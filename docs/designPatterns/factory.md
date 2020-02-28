> 定义：定义一个创建对象的类，由这个类来封装实例化对象的行为。   
> **使用Vue组件注册和React.createElement示例介绍工厂模式，但不对框架源码实现细节进行分析**

1. **Vue组件注册** 
``` javascript
class VNode {
  // ...
  constructor(/* ...... */){
    // ...
  }
}

function _createElement(/* ...... */){
  // ....
  let vnode = new VNode(/* ...... */)
  return vnode
}
```

2. **React.createElement**
```javascript
const ReactElement = function(/* ... */){
  const element = {
    /* ... */
  }
  // ...
  return element
}

function createElement(/*...*/) {
  // ...
  return ReactElement(/*...*/)
}
```