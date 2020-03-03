> 定义：当一个对象的内部状态发生改变时，会导致其行为的改变，这看起来像是改变了对象。    
> **使用ES6的Promise和业务中常见的示例来介绍状态模式**

1. **Promise**
``` javascript
/**
 * 1. Pending
 * 2. Resolved
 * 3. Rejected
 */
new Promise(/* */)
```

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