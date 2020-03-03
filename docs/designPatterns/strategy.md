> 定义：定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换。  
> **使用validator.js lib来介绍策略模式**

1. **validator.js**
``` javascript
import isEmail from './lib/isEmail'
import isInt from './lib/isInt'
/*
*
*/
const validator = {
  isEmail,
  isInt,
  /**
   * 
  */
}
validator.isEmail('123@163.com'); //=> true
validator.isInt('123'); //=> false
```