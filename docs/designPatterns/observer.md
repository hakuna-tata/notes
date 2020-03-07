> 定义：又称作发布-订阅模式或消息机制，定义了一种依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。  
> **使用Vue中的响应式原理以及Node.js中events模块来介绍观察者模式**

1. **Vue响应式原理**
``` javascript 
class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    // 给 Observer 添加 Dep 实例，用于收集依赖
    this.dep = new Dep()
    this.vmCount = 0
    // 为被劫持的对象添加__ob__属性，指向自身 Observer 实例。作为是否 Observer 的唯一标识。
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 劫持数组成员
      this.observeArray(value)
    } else {
      // 劫持对象
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 数据劫持方法
      defineReactive(obj, keys[i])
    }
  }

  // Observe a list of Array items.
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

/**
 *  数据劫持
 */
function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep() // 实例一个 Dep 实例
  const property = Object.getOwnPropertyDescriptor(obj, key) // 获取对象自身属性
  if (property && property.configurable === false) { // 没有属性或者属性不可写就没必要劫持了
    return
  }
  // 兼容预定义的 getter/setter
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) { // 初始化 val
    val = obj[key]
  }
  // 默认监听子对象，从 observe 开始，返回 __ob__ 属性 即 Observer 实例
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val // 执行预设的getter获取值
      if (Dep.target) {
        dep.depend() // 依赖收集
        if (childOb) { // 如果有子对象，则添加同样的依赖
          childOb.dep.depend() // Observer时的 this.dep = new Dep();
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      // 原有值和新值比较，值一样则不做处理
      // newVal !== newVal && value !== value 这个比较有意思，但其实是为了处理 NaN
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (getter && !setter) return
      if (setter) { // 执行预设setter
        setter.call(obj, newVal)
      } else { // 没有预设直接赋值
        val = newVal
      }
      childOb = !shallow && observe(newVal) // 是否要观察新设置的值
      dep.notify() // 派发更新
    }
  })
}

/** 
 * Dep发布者
 */
class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++ 
    this.subs = [] // 观察者集合
  }
 // 添加观察者
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
 // 移除观察者
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  // 如果存在 Dep.target，则进行依赖收集操作
  depend () { 
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice() // 避免污染原来的集合
    // 如果不是异步执行，先进行排序，保证观察者执行顺序
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update() // 派发更新
    }
  }
}

/**
 * Watcher观察者
 */ 
class Watcher {
  // ...
  constructor (
    vm: Component,
    expOrFn: string | Function, 
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean // 是否是渲染函数的观察者
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this) // 给组件实例的_watchers属性添加观察者实例
    if (options) {
      this.deep = !!options.deep 
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid 
    this.active = true // 观察者实例是否激活
    this.dirty = this.lazy
    // 避免依赖重复收集的处理
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else { // 类似于 Obj.a 的字符串
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  get () { // 触发取值操作，进而触发属性的getter
    pushTarget(this) // Dep 中提到的：给 Dep.target 赋值
    let value
    const vm = this.vm
    try {
      // 核心，运行观察者表达式，进行取值，触发getter，从而在闭包中添加watcher
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      if (this.deep) { // 如果要深度监测，再对 value 执行操作
        traverse(value)
      }
      // 清理依赖收集
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) { // 避免依赖重复收集
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this) // dep 添加订阅者
      }
    }
  }

  update () { // 派发更新
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run() // 同步直接运行
    } else { // 否则加入异步队列等待执行
      queueWatcher(this)
    }
  }

  // ...
}
```
> Vue响应式流程大概就是: 
> 1. 通过 observer 时 defineReactive 进行数据劫持；  
> 2. 在需要订阅的地方添加观察者（watcher），通过取值操作触发指定属性的 getter 方法，从而将观察者添加进 Dep 进行依赖收集；    
> 3. 然后在 Setter 触发的时候进行 notify，通知给所有 Watcher 并进行相应的 update。  


2. **Node.js events模块**
``` javascript
/**
 * 事件订阅者
 */
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;

function _addListener(target, type, listener, prepend) {
  let m;
  let events;
  let existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = ObjectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      const w = new Error('Possible EventEmitter memory leak detected. ' +
                          `${existing.length} ${String(type)} listeners ` +
                          `added to ${inspect(target, { depth: -1 })}. Use ` +
                          'emitter.setMaxListeners() to increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      process.emitWarning(w);
    }
  }

  return target;
}

/**
 * 事件触发者
 */
EventEmitter.prototype.emit = function emit(type, ...args) {
  let doError = (type === 'error');

  const events = this._events;
  if (events !== undefined) {
    if (doError && events[kErrorMonitor] !== undefined)
      this.emit(kErrorMonitor, ...args);
    doError = (doError && events.error === undefined);
  } else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    let er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      try {
        const capture = {};
        // eslint-disable-next-line no-restricted-syntax
        Error.captureStackTrace(capture, EventEmitter.prototype.emit);
        ObjectDefineProperty(er, kEnhanceStackBeforeInspector, {
          value: enhanceStackTrace.bind(this, er, capture),
          configurable: true
        });
      } catch {}

      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }

    let stringifiedEr;
    const { inspect } = require('internal/util/inspect');
    try {
      stringifiedEr = inspect(er);
    } catch {
      stringifiedEr = er;
    }

    // At least give some kind of context to the user
    const err = new ERR_UNHANDLED_ERROR(stringifiedEr);
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  const handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    const result = ReflectApply(handler, this, args);

    // We check if result is undefined first because that
    // is the most common case so we do not pay any perf
    // penalty
    if (result !== undefined && result !== null) {
      addCatch(this, result, type, args);
    }
  } else {
    const len = handler.length;
    const listeners = arrayClone(handler, len);
    for (let i = 0; i < len; ++i) {
      const result = ReflectApply(listeners[i], this, args);

      // We check if result is undefined first because that
      // is the most common case so we do not pay any perf
      // penalty.
      // This code is duplicated because extracting it away
      // would make it non-inlineable.
      if (result !== undefined && result !== null) {
        addCatch(this, result, type, args);
      }
    }
  }

  return true;
}
```