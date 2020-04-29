let oldArrayPrototype = Array.prototype;
let proto = Object.create(oldArrayPrototype);
['push', 'shift', 'unshift', 'reverse', 'pop', 'slice', 'splice'].forEach(method => {
  proto[method] = function(){
    updateView();
    oldArrayPrototype[method].call(this, ...arguments)
  }
})

function observer(data){
  if(typeof data !== 'object' || data === null){
    return data;
  }
  if(Array.isArray(data)){
    Object.setPrototypeOf(data, proto);
    // data.__protp__ = proto;
  }
  for(let i in data){
    if(typeof data[i] === 'object' && data[i] !== null){
      observer(data[i]);
    }else{
      defineReactive(data, i, data[i]);
    }
  }
}

function defineReactive(target, key, value){
  Object.defineProperty(target, key, {
    get(){
      return value;
    },
    set(newValue){
      observer(newValue);
      updateView();
      value = newValue;
    }
  })
}

function updateView(){
  console.log('update view');
}

let data = {name: 'fx', age: {number: 24}, hobby:[1,2,3]};
observer(data);

// data.title = 'test' (新增的属性不是响应式的)
// data.hobby.push(4);  (AOP重写数组)