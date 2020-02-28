> 定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。实现的方法为先判断实例存在与否，如果存在则直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象。  
> **使用Vue.use(plugin)类单例模式以及业务场景来介绍单例模式**

1. **vue.use(plugin)**
``` javascript
  Vue.use = function (plugin: Function | Object) {  // 接收一个 plugin 参数可以是 Function 也可以是 Object
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 判断插件是不是已经注册过，防止重复注册
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    // plugin 是 Object, Object中是否含有install方法
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    // plugin 是 Function
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
```

2. **业务场景**
``` javascript
  const showForm  = (function(){
    let form
    return function(name){
      if(!form){
        form = name
      }
      return form
    }
  })()
  // 通用的惰性单例
  const getSingle = function(fn){
    let instance
    return function(){
      return instance || (instance = fn.apply(this,arguments))
    }
  }

  var a = getSingle(showForm)
  var b = getSingle(showForm)
  console.log(a("1") === b("2")) // true
```