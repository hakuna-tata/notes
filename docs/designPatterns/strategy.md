> 定义：定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换。  
> **使用Vue中options合并以及validator.js lib来介绍策略模式**

1. **Vue中merge options**
``` javascript
Vue.prototype._init = function (options?: Object) {
  /**
   * 
   */
  // 创建Component类型的vnode时_isComponent变为true
  if (options && options._isComponent) {
      initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  /**
   * 
   */
}

function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
  ) {
    /* 
    * 合并策略不做分析
    */
   if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }
  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

// _isComponent为true
function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```
2. **validator.js**
``` javascript
import isEmail from './lib/isEmail'
import isInt from './lib/isInt'
/*
*
*/
const validator = {
  isEmail,
  isInt,
  /**
   * 
  */
}
validator.isEmail('123@163.com'); //=> true
validator.isInt('123'); //=> false
```

总结验证：
> 1. 符合开放/封闭原则（将算法封装在独立的 strategy 中，使得它们易于切换，易于理解，易于扩展）  
> 2. 利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句