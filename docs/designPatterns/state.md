> 定义：当一个对象的内部状态发生改变时，会导致其行为的改变，这看起来像是改变了对象。    
> **使用ES6的Promise和业务中常见的示例来介绍状态模式**

1. **Promise**
``` javascript
const PENDING = "PENDING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";

// 兼容所有 promise ，比如 bluebird , Q 等 
const resolvePromise = (promise2, x, resolve, reject) => {
  if(promise2 === x){
    // x 的值与 promise2 是同一个直接抛错
    return reject(new TypeError("Chaining cycle detected for promise #<Promise>"))
  }
  if((typeof x === "object" && x !== null) || typeof x === "function"){
    // x 为 promise ,防止第三方 x.then 出错
    try{
      let then = x.then;
      if(typeof then === "function"){
        // 直接执行 then 方法
        then.call(x, y => {
          // y 如果还是一个 promise
          resolvePromise(promise2, y, resolve, reject); 
        }, r => {
          reject(r);
        })
      }else{
        // { then: 123 } 
        resolve(x);
      }
    }catch(e){
      reject(e);
    }
  }else{
    // x 是普通值
    resolve(x);
  }
}

class Promise{
  constructor(executor){
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    // PENDING 状态回调数组
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      if(this.status === PENDING){
        this.status = RESOLVED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    }

    let reject = (reason) => {
      if(this.status === PENDING){
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try{
      executor(resolve, reject);
    }catch(e){
      reject(e);
    }
  }
  then(onFulfilled, onRejected){
    // onFulfilled，onRejected 可选参数，值具有穿透性
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : res => res;
    onRejected = typeof onRejected === "function" ? onRejected : err => {
      throw err;
    }

    let promise2 = new Promise((resolve, reject) => {
      // 同步
      if(this.status === RESOLVED){
        setTimeout(() => {
          try{ // 捕获调用 onFulfilled 时出错
            let x = onFulfilled(this.value);
            // x可能是普通值，也可能是 promise (利用 setTimeout 异步取到 promise2 )
            resolvePromise(promise2, x, resolve, reject);
          }catch(e){
            reject(e)
          }
        }, 0)   
      }
      if(this.status === REJECTED){
        setTimeout(() => {
          try{
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          }catch(e){
            reject(e)
          }
        }, 0)  
      }
      // new Promise 里有异步操作时候， 执行 then 状态任为 PENDING
      if(this.status === PENDING){
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try{
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            }catch(e){
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try{
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            }catch(e){
              reject(e)
            }
          }, 0)
        })
      }
    })

    return promise2;
  }
}
```
[Promise/A+规范实现代码测试](https://github.com/hakuna-tata/Promise)

2. **业务场景**
``` javascript
var cxkState = function(){
  var _currentState = {},
      states = {
        sing: function(){
          console.log("唱")
        },
        jump: function(){
          console.log("跳")
        },
        rap: function(){
          console.log("rap")
        },
        basketball: function(){
          console.log("篮球")
        }
      };
  var action = {
    changeState: function(){
      var args = arguments;
      _currentState = {};
      if(args.length){
        for(var i = 0; i < args.length; i++){
          _currentState[args[i]] = true
        }
      }
      return this;
    },
    play: function(){
      console.log("music");
      for(var i in _currentState){
        states[i] && states[i]()
      }
      return this;
    }
  }
  return {
    changeState: action.changeState,
    play: action.play
  }
}
var cxk = new cxkState()
cxk.changeState('sing','rap').play()
  .changeState('basketball').play()
  .changeState('jump','sing').play()
  /**
  music
  唱
  rap
  music
  篮球
  music
  跳
  唱 
   */
```