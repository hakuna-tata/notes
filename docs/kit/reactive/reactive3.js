let toProxy = new WeakMap();
let toRaw = new WeakMap();

function isObject(val){
  return typeof val === 'object' && val !== null;
}

function reactive(target){
  return createReactiveObject(target)
}

function createReactiveObject(target){
  if(!isObject(target)){
    return target;
  }
  if(toProxy.has(target)){  // 如果 target 已经代理过，直接返回代理对象（一直重复reactive(target)）
    return toProxy.get(target);
  }
  if(toRaw.has(target)){  // 防止代理对象再次被代理（一直重复reactive(proxy)）
    return target;
  }
  let baseHandler = {
    get: function(target, key, receiver){
      console.log('get');
      let result = Reflect.get(target, key, receiver);
      return isObject(result) ? reactive(result) : result;
    },
    set: function(target, key, value, receiver){
      let oldValue = Reflect.get(target, key, receiver);
      if(!Reflect.has(target, key)){
        // 新增属性
        console.log('add set')
      }else if(oldValue !== value){
        // 修改已有属性
        console.log('modify set')
      }
      let res = Reflect.set(target, key, value, receiver);
      return res;
    },
    deleteProperty: function(target, key){
      console.log('del');
      let res = Reflect.deleteProperty(target, key);
      return res;
    }
  };
  let observed = new Proxy(target, baseHandler);
  toProxy.set(target, observed);
  toRaw.set(observed, target);
  return observed;
}

// let proxy = reactive({name: {title: 'fx'}});
// proxy.name.title = 'ljf';

let proxy = reactive({name: [1,2,3]});
proxy.name.push(4);