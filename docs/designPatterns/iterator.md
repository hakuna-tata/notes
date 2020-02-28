> 定义：提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。  
> **使用ES6的Iterator和for...of循环示例来介绍迭代器模式**

1. **Iterator**
``` Typescript
/* ES6中有三类数据结构原生具备Iterator接口(部署在[Symbol.iterator]属性上)：
  * 1.数组
  * 2.Set和Map结构
  * 3.某些类似数组的对象(String,arguments,NodeList,...)
*/
interface Iterable {
 [Symbol.iterator]() : Iterator, 
}
interface Iterator {
 next(value?: any) : IterationResult,
}
interface IterationResult {
 value: any,
 done: boolean, 
}
// browsers test demo
Array.prototype[Symbol.iterator]
// ƒ values() { [native code] }
Array.prototype[Symbol.iterator]()
// Array Iterator {}
Array.prototype[Symbol.iterator]().next()
// {value: undefined, done: true}
```
``` javascript
function each(data){ // data具有[Symbol.iterator]属性对应的遍历器生成函数
  // 生成遍历器
  let iterator = data[Symbol.iterator]()
  // console.log(iterator.next()) // 有数据返回{value：1, done: false}
  // console.log(iterator.next()) // 没有数据返回{value：undefined, done: true}
  let item = {done: false}
  while(!item.done){
    item = iterator.next()
    if(!item.done){
      console.log(item.value)
    }
  }
}
```

2. **for...of**
``` javascript
/**
 * 1.[Symbol.iterator]并不是每个开发者都需要知道
 * 2.也不是每个开发者需要封装一个each方法
 * 3.ES6提供`for...of`语法 (each方法的封装)
*/
for(let item of data){ // data = ["a","b"]
  console.log(item) // a b
}
for(let item in data){ // data = ["a","b"]
  console.log(item) // 0 1
}
```