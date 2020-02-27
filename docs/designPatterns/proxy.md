> 定义：为对象提供一种代理以控制对这个对象的访问。  
> **使用Vue中this对data的直接访问来介绍代理模式**

1. **Vue中this对data的直接访问**
``` javascript
function initData (vm: Component) {
  let data = vm.$options.data
  // 将vm.$options.data映射到vm._data中，使得可以通过vm._data访问数据变量
  data = vm._data = typeof data === 'function'
  ? getData(data, vm)
  : data || {}
  /**
   * 
   */
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      //处理data中字段与methods方法字段命名冲突的情况
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
      //处理data中字段与props字段命名冲突的情况
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      //代理，实现vm.key直接访问数据的方法
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}

function proxy (target: Object, sourceKey: string, key: string) {
  // 在读取属性的时候，实际上读取的是vm._data,也就是此变量就是对vm._data(也就是vm.$options.data)的代理
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  // 设置数据属性变量
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

总结验证：
> 1. 符合开放/封闭原则
> 2. 代理类和目标类分离，隔离开目标类和使用者