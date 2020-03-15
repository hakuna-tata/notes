## Koa介绍
> Koa 是一个 Node.js 框架，利用 async 函数，Koa丢弃了回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件，给人一种干净利落的感觉，体积小、编程方式干净。

Koa源码主要就是以下内容：
1. ctx等api实现；

2. 中间件实现原理；

3. 异常处理；

## 简析实现Koa中间件机制
``` js
const http = require("http");
const EventEmitter = require('events');

class Koa extends EventEmitter{
  constructor(){
    super();
    // 存放中间件
    this.middlewares = [];
    this.context = Object.create({});
  }
  // 添加中间件
  use(fn){
    this.middleware.push(fn);
    return this;
  }
  // 原生 node.js 创建http服务的封装
  listen(...args){
    let server = http.createServer(this.handlerRequest.bind(this));
    server.listen(...args);
  }
  // 原生 node.js createServer返回一个handler callback
  handlerRequest(req, res){
    const PromiseChain = this.compose(this.middlewares);
    const ctx = this.createContext(req, res);
    PromiseChain(ctx);
  }
  // ctx等api实现
  createContext(req, res){
    this.context.app = this;
    this.context.req = req;
    this.context.res = res;
    return this.context;
  }
  // 中间件机制
  compose(middlewares){
    let index = -1;
    return function(context){
      function dispatch(i){
        // 一个中间件调用多次next
        if (i <= index) return Promise.reject(new Error('next() called multiple times'));
        index = i;
        if(index === middlewares.length) return Promise.resolve();
        let middlewareFn = middlewares[index];
        return Promise.resolve(middlewareFn(context, () => dispatch(i + 1)));
      }
      return dispatch(0);
    }
  }
}
module.exports = Koa
```
## 总结
> 以上玩具代码主要是为了在理解使用Koa时能更加得心应手，遇到问题能快速定位。