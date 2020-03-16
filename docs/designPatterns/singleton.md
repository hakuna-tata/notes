> 定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。  
> **使用Vue中工具方法once以及Vue.use(plugin)来介绍单例模式**

1. **vue src/shared/util**
```typescript
/**
 * Ensure a function is called only once.
 */
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
```


2. **vue.use(plugin)类似单例模式**
``` javascript
  Vue.use = function (plugin: Function | Object) {  // 接收一个 plugin 参数可以是 Function 也可以是 Object
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 判断插件是不是已经注册过，防止重复注册
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    const args = toArray(arguments, 1) // []
    // 将 Vue 对象推入 args 头部，执行 install 方法第一个参数就可以拿到 Vue 对象，因此插件的编写方不需要再额外去import Vue 了
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
```