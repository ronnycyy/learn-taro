import * as fs from 'fs-extra'
import * as path from 'path'

import { Config as IConfig } from '@tarojs/taro'
import * as wxTransformer from '@tarojs/transformer-wx'
import * as _ from 'lodash'
import traverse from 'babel-traverse'

import { IWxTransformResult, TogglableOptions } from '../util/types'
import {
  REG_TYPESCRIPT,
  processTypeEnum,
  NODE_MODULES_REG,
  NODE_MODULES,
  PARSE_AST_TYPE,
  BUILD_TYPES
} from '../util/constants'
import {
  printLog,
  isEmptyObject,
  promoteRelativePath,
  isDifferentArray,
  generateQuickAppUx,
  uglifyJS,
  extnameExpRegOf,
  generateAlipayPath
} from '../util'

import { parseComponentExportAst, parseAst } from './astProcess'
import { IComponentObj, IBuildResult } from './interface'
import {
  setHasBeenBuiltComponents,
  isComponentHasBeenBuilt,
  getBuildData,
  setComponentExportsMap,
  getComponentExportsMap,
  getRealComponentsPathList,
  copyFilesFromSrcToOutput,
  getDependencyTree,
  buildUsingComponents,
  getDepComponents,
  getImportTaroSelfComponents
} from './helper'
import { compileScriptFile, compileDepScripts } from './compileScript'
import { compileDepStyles } from './compileStyle'
import { transfromNativeComponents, processNativeWxml } from './native'

const notTaroComponents = new Set<string>()
const componentsNamedMap = new Map<string, { name?: string, type?: string }>()
const componentsBuildResult = new Map<string, IBuildResult>()

export function getComponentsNamedMap () {
  return componentsNamedMap
}

export function isFileToBeTaroComponent (
  code: string,
  sourcePath: string,
  outputPath: string
) {
  const {
    buildAdapter,
    sourceDir,
    constantsReplaceList,
    jsxAttributeNameReplace,
    alias
  } = getBuildData()
  const transformResult: IWxTransformResult = wxTransformer({
    code,
    sourcePath: sourcePath,
    sourceDir,
    outputPath: outputPath,
    isNormal: true,
    isTyped: REG_TYPESCRIPT.test(sourcePath),
    adapter: buildAdapter,
    env: constantsReplaceList,
    jsxAttributeNameReplace,
    alias
  })
  const { ast }: IWxTransformResult = transformResult
  let isTaroComponent = false

  traverse(ast, {
    JSXElement () {
      isTaroComponent = true
    }
  })

  return {
    isTaroComponent,
    transformResult
  }
}

export interface IComponentBuildConfig {
  outputDir?: string,
  outputDirName?: string,
  npmSkip?: boolean
}

export function buildDepComponents (
  componentPathList: IComponentObj[],
  buildConfig?: IComponentBuildConfig
): Promise<IBuildResult[]> {
  return Promise.all(componentPathList.map(componentObj => buildSingleComponent(componentObj, buildConfig)))
}

export async function buildSingleComponent (
  componentObj: IComponentObj,
  buildConfig: IComponentBuildConfig = {}
): Promise<IBuildResult> {

  const {
    appPath,
    buildAdapter,
    constantsReplaceList,
    sourceDir,
    outputDir,
    sourceDirName,
    outputDirName,
    npmOutputDir,
    nodeModulesPath,
    outputFilesTypes,
    isProduction,
    jsxAttributeNameReplace,
    projectConfig,
    alias
  } = getBuildData()
  const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP

  if (componentObj.path) {
    componentsNamedMap.set(componentObj.path, {
      name: componentObj.name,
      type: componentObj.type
    })
  }
  const component = componentObj.path
  if (!component) {
    printLog(processTypeEnum.ERROR, '????????????', `??????${_.upperFirst(_.camelCase(componentObj.name))}???????????????????????????????????????????????????????????????????????????`)
    return {
      js: '',
      wxss: '',
      wxml: ''
    }
  }
  let componentShowPath = component.replace(appPath + path.sep, '')
  componentShowPath = componentShowPath.split(path.sep).join('/')
  if (buildAdapter === BUILD_TYPES.ALIPAY) {
    componentShowPath = generateAlipayPath(componentShowPath)
  }
  let isComponentFromNodeModules = false
  let sourceDirPath = sourceDir
  let buildOutputDir = outputDir
  // ?????? node_modules ?????????
  if (NODE_MODULES_REG.test(componentShowPath)) {
    isComponentFromNodeModules = true
    sourceDirPath = nodeModulesPath
    buildOutputDir = npmOutputDir
  }
  let outputComponentShowPath = componentShowPath.replace(isComponentFromNodeModules ? NODE_MODULES : sourceDirName, buildConfig.outputDirName || outputDirName)
  outputComponentShowPath = outputComponentShowPath.replace(extnameExpRegOf(outputComponentShowPath), '')
  printLog(processTypeEnum.COMPILE, '????????????', componentShowPath)
  const componentContent = fs.readFileSync(component).toString()
  let outputComponentJSPath = component.replace(sourceDirPath, buildConfig.outputDir || buildOutputDir).replace(extnameExpRegOf(component), outputFilesTypes.SCRIPT)
  if (buildAdapter === BUILD_TYPES.ALIPAY) {
    outputComponentJSPath = generateAlipayPath(outputComponentJSPath)
  }
  const outputComponentWXMLPath = outputComponentJSPath.replace(extnameExpRegOf(outputComponentJSPath), outputFilesTypes.TEMPL)
  const outputComponentWXSSPath = outputComponentJSPath.replace(extnameExpRegOf(outputComponentJSPath), outputFilesTypes.STYLE)
  const outputComponentJSONPath = outputComponentJSPath.replace(extnameExpRegOf(outputComponentJSPath), outputFilesTypes.CONFIG)

  try {
    const isTaroComponentRes = isFileToBeTaroComponent(componentContent, component, outputComponentJSPath)
    const componentExportsMap = getComponentExportsMap()
    if (!isTaroComponentRes.isTaroComponent) {
      const transformResult = isTaroComponentRes.transformResult
      const componentRealPath = parseComponentExportAst(transformResult.ast, componentObj.name as string, component, componentObj.type as string)
      const realComponentObj: IComponentObj = {
        path: componentRealPath,
        name: componentObj.name,
        type: componentObj.type
      }
      let isInMap = false
      notTaroComponents.add(component)
      if (componentExportsMap.size) {
        componentExportsMap.forEach(componentExports => {
          componentExports.forEach(item => {
            if (item.path === component) {
              isInMap = true
              item.path = componentRealPath
            }
          })
        })
      }
      if (!isInMap) {
        const componentExportsMapItem = componentExportsMap.get(component) || []
        componentExportsMapItem.push(realComponentObj)
        setComponentExportsMap(component, componentExportsMapItem)
      }
      return await buildSingleComponent(realComponentObj, buildConfig)
    }
    if (isComponentHasBeenBuilt(componentObj.path as string) && componentsBuildResult.get(componentObj.path as string)) {
      return componentsBuildResult.get(componentObj.path as string) as IBuildResult
    }
    const buildResult = {
      js: outputComponentJSPath,
      wxss: outputComponentWXSSPath,
      wxml: outputComponentWXMLPath
    }
    componentsBuildResult.set(component, buildResult)
    const transformResult: IWxTransformResult = wxTransformer({
      code: componentContent,
      sourcePath: component,
      sourceDir,
      outputPath: outputComponentJSPath,
      isRoot: false,
      isTyped: REG_TYPESCRIPT.test(component),
      isNormal: false,
      adapter: buildAdapter,
      env: constantsReplaceList,
      jsxAttributeNameReplace,
      alias
    })
    const componentWXMLContent = isProduction ? transformResult.compressedTemplate : transformResult.template
    const componentDepComponents = transformResult.components
    const res = parseAst(PARSE_AST_TYPE.COMPONENT, transformResult.ast, componentDepComponents, component, outputComponentJSPath, buildConfig.npmSkip)
    let resCode = res.code
    fs.ensureDirSync(path.dirname(outputComponentJSPath))
    if (!isComponentHasBeenBuilt(component)) {
      setHasBeenBuiltComponents(component)
    }
    // ??????????????????
    const { usingComponents = {} }: IConfig = res.configObj
    if (usingComponents && !isEmptyObject(usingComponents)) {
      const keys = Object.keys(usingComponents)
      keys.forEach(item => {
        componentDepComponents.forEach(component => {
          if (_.camelCase(item) === _.camelCase(component.name)) {
            delete usingComponents[item]
          }
        })
      })
      transfromNativeComponents(outputComponentJSONPath.replace(buildConfig.outputDir || buildOutputDir, sourceDirPath), res.configObj)
    }
    let realComponentsPathList: IComponentObj[] = []
    realComponentsPathList = getRealComponentsPathList(component, componentDepComponents)

    if (!isQuickApp) {
      resCode = await compileScriptFile(resCode, component, outputComponentJSPath, buildAdapter)
      if (isProduction) {
        resCode = uglifyJS(resCode, component, appPath, projectConfig!.plugins!.uglify as TogglableOptions)
      }
    } else {
      // ???????????????????????????????????? ux ??????
      const importTaroSelfComponents = getImportTaroSelfComponents(outputComponentJSPath, res.taroSelfComponents)
      const importCustomComponents = new Set(realComponentsPathList.map(item => {
        return {
          path: promoteRelativePath(path.relative(component, item.path as string)).replace(extnameExpRegOf(item.path as string), ''),
          name: item.name as string
        }
      }))
      const usingComponents = res.configObj.usingComponents
      let importUsingComponent: any = new Set([])
      if (usingComponents) {
        importUsingComponent = new Set(Object.keys(usingComponents).map(item => {
          return {
            name: item,
            path: usingComponents[item]
          }
        }))
      }
      let styleRelativePath
      if (res.styleFiles.length) {
        styleRelativePath = promoteRelativePath(path.relative(outputComponentJSPath, outputComponentWXSSPath))
      }
      const uxTxt = generateQuickAppUx({
        script: resCode,
        style: styleRelativePath,
        imports: new Set([...importTaroSelfComponents, ...importCustomComponents, ...importUsingComponent]),
        template: componentWXMLContent
      })
      fs.writeFileSync(outputComponentWXMLPath, uxTxt)
      printLog(processTypeEnum.GENERATE, '????????????', `${outputComponentShowPath}${outputFilesTypes.TEMPL}`)
    }

    const dependencyTree = getDependencyTree()
    const fileDep = dependencyTree.get(component) || {
      style: [],
      script: [],
      json: [],
      media: []
    }
    // ???????????????????????????
    if (realComponentsPathList.length) {
      res.scriptFiles = res.scriptFiles.map(item => {
        for (let i = 0; i < realComponentsPathList.length; i++) {
          const componentObj = realComponentsPathList[i]
          const componentPath = componentObj.path
          if (item === componentPath) {
            return ''
          }
        }
        return item
      }).filter(item => item)
      realComponentsPathList = realComponentsPathList.filter(item => !isComponentHasBeenBuilt(item.path as string) || notTaroComponents.has(item.path as string))
      await buildDepComponents(realComponentsPathList, buildConfig)
    }
    if (componentExportsMap.size && realComponentsPathList.length) {
      realComponentsPathList.forEach(componentObj => {
        if (componentExportsMap.has(componentObj.path as string)) {
          const componentMap = componentExportsMap.get(componentObj.path as string)
          componentMap && componentMap.forEach(componentObj => {
            componentDepComponents.forEach(depComponent => {
              if (depComponent.name === componentObj.name) {
                let componentPath = componentObj.path
                let realPath
                if (NODE_MODULES_REG.test(componentPath as string)) {
                  componentPath = (componentPath as string).replace(nodeModulesPath, npmOutputDir)
                  realPath = promoteRelativePath(path.relative(outputComponentJSPath, componentPath))
                } else {
                  realPath = promoteRelativePath(path.relative(component, (componentPath as string)))
                }
                depComponent.path = realPath.replace(extnameExpRegOf(realPath), '')
              }
            })
          })
        }
      })
    }
    if (!isQuickApp) {
      fs.writeFileSync(outputComponentJSONPath, JSON.stringify(_.merge({}, buildUsingComponents(component, componentDepComponents, true), res.configObj), null, 2))
      printLog(processTypeEnum.GENERATE, '????????????', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.CONFIG}`)
      fs.writeFileSync(outputComponentJSPath, resCode)
      printLog(processTypeEnum.GENERATE, '????????????', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.SCRIPT}`)
      fs.writeFileSync(outputComponentWXMLPath, componentWXMLContent)
      processNativeWxml(outputComponentWXMLPath.replace(outputDir, sourceDir), componentWXMLContent, outputComponentWXMLPath)
      printLog(processTypeEnum.GENERATE, '????????????', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.TEMPL}`)
    }
    // ???????????????????????????
    if (isDifferentArray(fileDep['script'], res.scriptFiles)) {
      await compileDepScripts(res.scriptFiles, !isQuickApp)
    }
    const depComponents = getDepComponents()
    // ??????????????????
    if (isDifferentArray(fileDep['style'], res.styleFiles) || isDifferentArray(depComponents.get(component) || [], componentDepComponents)) {
      printLog(processTypeEnum.GENERATE, '????????????', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.STYLE}`)
      await compileDepStyles(outputComponentWXSSPath, res.styleFiles)
    }
    // ??????????????????
    if (isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }
    if (isDifferentArray(fileDep['media'], res.mediaFiles)) {
      copyFilesFromSrcToOutput(res.mediaFiles)
    }
    fileDep['style'] = res.styleFiles
    fileDep['script'] = res.scriptFiles
    fileDep['json'] = res.jsonFiles
    fileDep['media'] = res.mediaFiles
    dependencyTree.set(component, fileDep)
    depComponents.set(component, componentDepComponents)

    return buildResult
  } catch (err) {
    printLog(processTypeEnum.ERROR, '????????????', `??????${componentShowPath}???????????????`)
    if (!isComponentHasBeenBuilt(component)) {
      setHasBeenBuiltComponents(component)
    }
    console.log(err)
    return {
      js: '',
      wxss: '',
      wxml: ''
    }
  }
}
