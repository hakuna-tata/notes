> 定义： 就是为了解决两个软件实体间的接口不兼容的问题。  
> **使用axios中的adapter属性来介绍适配器模式**

1. **axios中的adapter**
``` javascript
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter()
  /**
   * 
   */
}
```
总结验证：
> 1. 符合开放封闭原则  
> 2. 不需要改变已有的接口，就能够使它们协同作用