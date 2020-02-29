> 定义：在不改变原对象的基础上，通过对其进行包装扩展，使原有对象可以满足更复杂需求。  
> **使用ES7的修饰器和core-decorators.js lib来介绍修饰器模式**

1. **ES7中的Decorator**
``` javascript
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  } 
}
/**
 * target: MyClass.prototype
 * name: "name"
 * descriptor: {
    value: specifiedFunction,
    enumerable: false,
    configurable: true,
    writable: true
   }
 * 类似Object.defineProperty(MyClass.prototype, 'name', descriptor);
 */
function readonly(target, name, descriptor){
 descriptor.writable = false;
 return descriptor; 
}

@testable(false)
class MyClass {
  @readonly
  name(){
    return ``
  }
}
MyClass.isTestable // false
```

2. **core-decorators.js**
``` javascript
// 防抖函数
import { debounce } from 'core-decorators';

class UpdatePosition{
  content = ""

  @debounce(1000)
  updatePosition(content) {
    this.content = content;
  }
}

// core-decorators.js debounce
function handleDescriptor(target, key, descriptor, [wait = DEFAULT_TIMEOUT, immediate = false]) {
  const callback = descriptor.value;

  if (typeof callback !== 'function') {
    throw new SyntaxError('Only functions can be debounced');
  }

  return {
    ...descriptor,
    value() {
      const { debounceTimeoutIds } = metaFor(this);
      const timeout = debounceTimeoutIds[key];
      const callNow = immediate && !timeout;
      const args = arguments;

      clearTimeout(timeout);
      // 每次都覆盖之前的防抖函数，执行最后一次传入的callback函数
      debounceTimeoutIds[key] = setTimeout(() => {
        delete debounceTimeoutIds[key];
        if (!immediate) {
          callback.apply(this, args);
        }
      }, wait);

      if (callNow) { //先执行再等待
        callback.apply(this, args);
      }
    }
  };
}
```