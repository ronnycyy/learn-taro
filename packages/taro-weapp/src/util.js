import isPlainObject from 'lodash/isPlainObject'
import { Current } from '@tarojs/taro'
import { SimpleMap } from '@tarojs/utils'

export function isEmptyObject(obj) {
  if (!obj || !isPlainObject(obj)) {
    return false
  }
  for (const n in obj) {
    if (obj.hasOwnProperty(n)) {
      return false
    }
  }
  return true
}

export function isUndefined(o) {
  return o === undefined
}

export function isNullOrUndef(o) {
  return isUndefined(o) || o === null
}

/**
 * JSON 克隆
 * @param {Object | Json} jsonObj json对象
 * @return {Object | Json} 新的json对象
 */
export function objClone(jsonObj) {
  let buf
  if (Array.isArray(jsonObj)) {
    buf = []
    let i = jsonObj.length
    while (i--) {
      buf[i] = objClone(jsonObj[i])
    }
    return buf
  } else if (isPlainObject(jsonObj)) {
    buf = {}
    for (const k in jsonObj) {
      buf[k] = objClone(jsonObj[k])
    }
    return buf
  } else {
    return jsonObj
  }
}

export function getPrototype(obj) {
  /* eslint-disable */
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(obj)
  } else if (obj.__proto__) {
    return obj.__proto__
  }
  /* eslint-enable */
  return obj.constructor.prototype
}

export function getPrototypeChain(obj) {
  const protoChain = []
  while ((obj = getPrototype(obj))) {
    protoChain.push(obj)
  }
  return protoChain
}

export function noop() { }

export function isFunction(arg) {
  return typeof arg === 'function'
}

export function isArray(arg) {
  return Array.isArray(arg)
}

export function cloneDeep(obj) {
  let newObj
  if (isArray(obj)) {
    newObj = []
    const len = obj.length
    for (let i = 0; i < len; i++) {
      newObj.push(cloneDeep(obj[i]))
    }
  } else if (isPlainObject(obj)) {
    newObj = {}
    for (const key in obj) {
      const ret = cloneDeep(obj[key])
      newObj[key] = ret
    }
  } else {
    return obj
  }
  return newObj
}

const keyList = Object.keys
const hasProp = Object.prototype.hasOwnProperty

function diffArrToPath(to, from, res = {}, keyPrev = '') {
  const len = to.length
  for (let i = 0; i < len; i++) {
    const toItem = to[i]
    const fromItem = from[i]
    const targetKey = `${keyPrev}[${i}]`
    if (toItem === fromItem) {
      continue
    } else if (typeof toItem !== typeof fromItem) {
      res[targetKey] = toItem
    } else {
      if (typeof toItem !== 'object') {
        res[targetKey] = toItem
      } else {
        const arrTo = isArray(toItem)
        const arrFrom = isArray(fromItem)
        if (arrTo !== arrFrom) {
          res[targetKey] = toItem
        } else if (arrTo && arrFrom) {
          if (toItem.length < fromItem.length) {
            res[targetKey] = toItem
          } else {
            // 数组
            diffArrToPath(toItem, fromItem, res, `${targetKey}`)
          }
        } else {
          if (!toItem || !fromItem || keyList(toItem).length < keyList(fromItem).length) {
            res[targetKey] = toItem
          } else {
            // 对象
            let shouldDiffObject = isPlainObject(toItem)

            shouldDiffObject &&
              Object.keys(fromItem).some(key => {
                if (typeof toItem[key] === 'undefined' && typeof fromItem[key] !== 'undefined') {
                  shouldDiffObject = false
                  return true
                }
              })

            if (shouldDiffObject) {
              diffObjToPath(toItem, fromItem, res, `${targetKey}.`)
            } else {
              res[targetKey] = toItem
            }
          }
        }
      }
    }
  }
  return res
}

/**
 * Diff 算法
 * 基本思想: 把属性平铺，仅传递修改部分
 * 
 * 假设 update 前的数据为
 * {
 *   a:1,
 *   b:2,
 *   c:{
 *      d:1,
 *      g:999,
 *      y: {
 *        deep: 123
 *      }
 *   }
 * }
 * 
 * 增:(最外面加一个e:9)
 * 'a.b.c.e': 9
 * 改:(d改成6)
 * 'a.b.c.d': 6
 * 删:(略有不同，把d删了)
 * 'a.b.c': { g:999,y:{deep:123} }  // 整棵c子树都要写
 */
// 比较的对象均为plainObject，且函数已被过滤
export function diffObjToPath(to, from, res = {}, keyPrev = '') {
  const keys = keyList(to)
  const len = keys.length

  for (let i = 0; i < len; i++) {
    const key = keys[i]
    const toItem = to[key]
    const fromItem = from[key]
    const targetKey = `${keyPrev}${key}`
    if (/^\$compid__/.test(key)) {
      res[targetKey] = toItem
    } else if (toItem === fromItem) {
      continue
    } else if (!hasProp.call(from, key)) {
      res[targetKey] = toItem
    } else if (typeof toItem !== typeof fromItem) {
      res[targetKey] = toItem
    } else {
      if (typeof toItem !== 'object') {
        res[targetKey] = toItem
      } else {
        const arrTo = isArray(toItem)
        const arrFrom = isArray(fromItem)
        if (arrTo !== arrFrom) {
          res[targetKey] = toItem
        } else if (arrTo && arrFrom) {
          if (toItem.length < fromItem.length) {
            res[targetKey] = toItem
          } else {
            // 数组
            diffArrToPath(toItem, fromItem, res, `${targetKey}`)
          }
        } else {
          // null
          if (!toItem || !fromItem) {
            res[targetKey] = toItem
          } else {
            // 对象
            let shouldDiffObject = isPlainObject(toItem)

            shouldDiffObject &&
              Object.keys(fromItem).some(key => {
                if (typeof toItem[key] === 'undefined' && typeof fromItem[key] !== 'undefined') {
                  shouldDiffObject = false
                  return true
                }
              })

            if (shouldDiffObject) {
              diffObjToPath(toItem, fromItem, res, `${targetKey}.`)
            } else {
              res[targetKey] = toItem
            }
          }
        }
      }
    }
  }
  return res
}

export function queryToJson(str) {
  const dec = decodeURIComponent
  const qp = str.split('&')
  let ret = {}
  let name
  let val
  for (let i = 0, l = qp.length, item; i < l; ++i) {
    item = qp[i]
    if (item.length) {
      const s = item.indexOf('=')
      if (s < 0) {
        name = dec(item)
        val = ''
      } else {
        name = dec(item.slice(0, s))
        val = dec(item.slice(s + 1))
      }
      if (typeof ret[name] === 'string') { // inline'd type check
        ret[name] = [ret[name]]
      }

      if (isArray(ret[name])) {
        ret[name].push(val)
      } else {
        ret[name] = val
      }
    }
  }
  return ret // Object
}

const _loadTime = (new Date()).getTime().toString()
let _i = 1
export function getUniqueKey() {
  return _loadTime + (_i++)
}

export function getElementById(component, id, type) {
  if (!component) return null

  let res
  if (type === 'component') {
    res = component.selectComponent(id)
    res = res ? (res.$component || res) : null
  } else {
    const query = wx.createSelectorQuery().in(component)
    res = query.select(id)
  }

  if (res) return res

  return null
}

let id = 0
function genId() {
  return String(id++)
}

let compIdsMapper
try {
  compIdsMapper = new Map()
} catch (error) {
  compIdsMapper = new SimpleMap()
}
export function genCompid(key, isNeedCreate) {
  if (!Current || !Current.current || !Current.current.$scope) return []

  const prevId = compIdsMapper.get(key)
  if (isNeedCreate) {
    const id = genId()
    compIdsMapper.set(key, id)
    return [prevId, id]
  } else {
    const id = prevId || genId()
    !prevId && compIdsMapper.set(key, id)
    return [null, id]
  }
}

let prefix = 0
export function genCompPrefix() {
  return String(prefix++)
}
