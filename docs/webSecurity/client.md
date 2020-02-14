## 浏览器安全

## 跨站脚本攻击(XSS)
> ***跨站脚本攻击***，英文全称是Cross Site Script，本来缩写是CSS，但是为了和  层叠样式表（CSS）有所区别,所以在安全领域叫做“XSS”。    
> **XSS攻击**分为反射型（url参数直接注入）和存储型（存储到DB后读取注入） 

常见的XSS攻击注入点：  
1. **HTML节点内容：**
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  //let data = "<script>alert(123)</script>"

  router.get('/test',async (ctx) => {
    ctx.body = 
      `<div>
        ${ctx.query.script ? ctx.query.script : "test"}
      </div>`
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```
* 包含了反射型XSS攻击的用户请求：  
  <img src="/webSecurity/xss/xss-dom1.png" style="display:block;margin:0 auto"/>  
* 包含了存储型XSS攻击的用户请求： 
  <img src="/webSecurity/xss/xss-dom2.png" style="display:block;margin:0 auto"/>  

2. **HTML属性** 
 ```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  //let imageSrc = '" onerror="alert(123)"'

  router.get('/test',async (ctx) => {
    let imageSrc = ctx.query.imageSrc
    ctx.body = 
      `<div>
        <img src="image/${imageSrc}">
      </div>`
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
 ```
* 包含了反射型XSS攻击的用户请求：
  <img src="/webSecurity/xss/xss-atr1.png" style="display:block;margin:0 auto"/>
* 包含了存储型XSS攻击的用户请求：略

3. **JS代码**  
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  router.get('/test',async (ctx) => {
    let test = ctx.query.test
    ctx.body = 
      `<div>
        <script>
          var test = ${test}
        </script>
      </div>
      `
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```
* 包含了反射型XSS攻击的用户请求：
  <img src="/webSecurity/xss/xss-js1.png" style="display:block;margin:0 auto"/>
* 包含了存储型XSS攻击的用户请求：略

4. **富文本**  
```
  有时候网站需要用户提交一些自定的HTML代码，称为“富文本”。比如一些帖子的内容要有图片，视频，
  表格等。这些“富文本”的效果都需要通过HTML代码来实现

  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  let html = `
      <img src="1" onerror="alert(1)">
      <script>alert(2)</script>
      <div>正常</div>
  `

  router.get('/test',async (ctx) => {
    ctx.body = html
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```
* 包含了存储型XSS攻击的用户请求：
  <img src="/webSecurity/xss/xss-rt1.png" style="display:block;margin:0 auto"/>

常见的XSS防御措施：
  1. **HTML节点内容转译：**
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  const escapeHtml = (str) => {
    if(!str) return "";
    str = str.replace(/&/g,'&amp;')
    str = str.replace(/</g,'&lt;')
    str = str.replace(/>/g,'&gt;')
    str = str.replace(/"/g,'&quto;')
    str = str.replace(/'/g,'&#39;')
    return str
  }

  router.get('/test',async (ctx) => {
    ctx.body = 
      `<div>
        ${ctx.query.script ? escapeHtml(ctx.query.script) : "test"}
      </div>`
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```
  * 处理结果：
  <img src="/webSecurity/xss/xss-dom3.png" style="display:block;margin:0 auto"/>

  2. **HTML属性转译**
  * 处理结果：
  <img src="/webSecurity/xss/xss-atr2.png" style="display:block;margin:0 auto"/>

  3. **JS代码转义**
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  router.get('/test',async (ctx) => {
    ctx.body = 
      `<div>
        <script>
          var text = ${JSON.stringify(ctx.query.test)}
        </script>
      </div>
      `
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```
  * 处理结果：
  <img src="/webSecurity/xss/xss-js2.png" style="display:block;margin:0 auto"/>

  4. **富文本白名单过滤**(GitHub:XSS第三方库)
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const cheerio = require("cheerio")
  const app = new Koa()
  const router = new Router()

  let html = `
      <img src="1" onerror="alert(1)">
      <script>alert(2)</script>
      <div>正常</div>
  `

  const xssFilter = (html) => {
    if(!html) return "";
    var $ = cheerio.load(html)

    // 白名单
    var whiteList = {
      "html":[],
      "body":[],
      "div":["class","id"],
      "img" : ["src"],
      "a": ["href"]
    }
    $('*').each((index,elem) => {
      if(!whiteList[elem.name]){
        $(elem).remove()
        return
      }
      for(var attr in elem.attribs){
        if(whiteList[elem.name].indexOf(attr) === -1){
          $(elem).attr(attr,null)
        }
      }
    })
    return $.html()
  }

  router.get('/test',async (ctx) => {
    ctx.body = xssFilter(html)
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```
* 处理结果：
  <img src="/webSecurity/xss/xss-rt2.png" style="display:block;margin:0 auto"/>

**总结强大的XSS Payload：**
     
> XSS攻击成功后，攻击者能够对用户当前浏览的页面植入恶意脚本，通过恶意脚本，控制用户的
 浏览器来执行一些违背用户的操作，例如：  
 1.劫持Cookie获取用户登录凭证  
 2.构造GET与POST请求  
 3.获取用户信息  
 4...  
 **XSS漏洞虽然复杂，但是是可以解决的。设计XSS解决方案时，应该深入理解XSS攻击原理，针对不同场景使用不同的方法**
 
## 跨站请求伪造(CSRF)

## 点击劫持(ClickJacking)

## HTML 5 安全