## 浏览器安全
>随着互联网的发展， **浏览器** 成为互联网最大的入口。因此浏览器市场竞争也越发激烈，所以浏览器带来的安全功能也越来越
强大，这也成为各大浏览器厂商之前竞争的一张底牌。  

浏览器一些主要的安全功能有：
1. **同源策略:**
* 浏览器的同源策略，限制了来自不同源的“document”或脚本，对当前“document”读取或设置某些属性  

  同源的条件（必须全部满足）：
    - protocol(协议)
    - host(子域名)
    - port(端口)

2. **CSP(Content Security Policy)**
* 在HTTP的响应头中设定CSP的规则，可以规定当前网页可以加载的资源的白名单（指定哪些内容可以执行），
从而减少网页受到XSS攻击的风险。所以说CSP是一个在现代浏览器加载资源白名单的安全机制，只有响应头中
白名单里列出的资源才能够被加载、执行。

3. **恶意网址拦截**
* 恶意网址拦截一般就是浏览器周期性从服务端获取一份恶意网址黑名单，如果用户上网时访问的网站存在于此
黑名单中，浏览器就会弹出一个警告页面。

4. **浏览器沙箱(Sandbox)**  
* 未来有时间研究webkit内核再来补充

## 跨站脚本攻击(XSS)
> ***跨站脚本攻击***，英文全称是Cross Site Script，本来缩写是CSS，但是为了和层叠样式表（CSS）有所区别,所以在安全领域叫做“XSS”。  
XSS攻击是攻击者能够对用户当前浏览的页面植入恶意脚本，通过恶意脚本，控制用户的浏览器来执行一些违背用户的操作。  

**XSS攻击**分为反射型（url参数直接注入）和存储型（存储到DB后读取注入）    

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
  <img src="/notes/webSecurity/xss/xss-dom1.png" style="display:block;margin:0 auto"/>  
* 包含了存储型XSS攻击的用户请求： 
  <img src="/notes/webSecurity/xss/xss-dom2.png" style="display:block;margin:0 auto"/>  

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
  <img src="/notes/webSecurity/xss/xss-atr1.png" style="display:block;margin:0 auto"/>
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
  <img src="/notes/webSecurity/xss/xss-js1.png" style="display:block;margin:0 auto"/>
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
  <img src="/notes/webSecurity/xss/xss-rt1.png" style="display:block;margin:0 auto"/>

常见的XSS防御措施：
1. **Set-Cookie时设置httpOnly标记**
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  router.get('/test',async (ctx) => {
    ctx.cookies.set("username","fffxue",{httpOnly:true})
    ctx.cookies.set("age","22",{httpOnly:false})
    ctx.body = ""
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))  
```
  * 客户端JS无法获取设置httpOnly的Cookie：
  <img src="/notes/webSecurity/xss/xss-cookie.png" style="display:block;margin:0 auto"/>

2. **HTML节点内容转译：**
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
  <img src="/notes/webSecurity/xss/xss-dom3.png" style="display:block;margin:0 auto"/>

3. **HTML属性转译**
  * 处理结果：
  <img src="/notes/webSecurity/xss/xss-atr2.png" style="display:block;margin:0 auto"/>

4. **JS代码转义**
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
  <img src="/notes/webSecurity/xss/xss-js2.png" style="display:block;margin:0 auto"/>

5. **富文本白名单过滤**(GitHub:XSS第三方库)
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
  <img src="/notes/webSecurity/xss/xss-rt2.png" style="display:block;margin:0 auto"/>

6. **CSP**(同浏览器安全介绍)
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  router.all("/*",async (ctx, next) => {
    ctx.set(`Content-Security-Policy`,`default-src 'self'`)
    await next()
  })
  router.get('/test',async(ctx) => {
    ctx.body = ""
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```
* 处理结果：
  <img src="/notes/webSecurity/xss/xss-csp.png" style="display:block;margin:0 auto"/>


**总结：**
     
> **XSS漏洞虽然复杂，但是是可以解决的。设计XSS解决方案时，应该深入理解XSS攻击原理，针对不同场景使用不同的方法**
 
## 跨站请求伪造(CSRF)
> ***跨站请求伪造***，英文全称是Cross Site Request Forgery。是一种在攻击者的网站，在用户毫不知情的情况下向用户的网站
发起请求。比如发生一些删帖，转载，购买等操作。

CSRF攻击的演示：
1. 先运行自己的服务器
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  router.get('/test/:test',async (ctx) => {
    console.log(ctx.params.test ? ctx.params.test : "")
    console.log(ctx.query.content ? ctx.query.content : "")
    console.log("delete post")
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))

```
2. 攻击者构造一个页面
```
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CSRF</title>
    </head>
  <body>
    <img src="http://localhost:8000/test/我来自csrf?content= <a href='C:\Users\liujianfeng\Desktop\test.html'>点击有Q币领取</a>"/>
  </body>
  </html>
```
* 当用户点击攻击者链接：
  <img src="/notes/webSecurity/csrf/csrf-1.png" style="display:block;margin:0 auto"/>  

其实：
> ***CSRF*** 攻击原理就是攻击者窃取用户的身份信息（Cookie）向用户网站发起请求（form表单，image标
签，a标签等）

CSRF的防御：
1. **验证码**  
  CSRF的攻击过程，往往是在用户不知情的情况下构造了网络请求。而验证码则强制用户必须与应用进行交互，
  才能完成最终请求。  
  但是验证码并不是万能。很多时候出于用户体验考虑，网站不能给所有的操作都加上验证码，所以验证码只能
  作为防御CSRF的一种辅助手段。 

2. **Referer Check**  
  Referer Check可以检查请求是否来自合法的“源”
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  router.get('/test',async (ctx) => {
    let referer = ctx.request.headers.referer
    if(!/^https?:\/\/localhost/.test(referer)){
      ctx.body = `<div>referer</div>`
    }else{
      ctx.body = `<div>非法地址</div>`
    }
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```

3. **Token**  
  Token就是随机数加密与后端校验的一种方式

4. **sameSite**  
  Cookie的sameSite属性用来限制第三方Cookie:  
  1.Strict最为严格，完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送Cookie。换言之，只有当前网页的URL与请求目标一致，才会带上Cookie。  
  2.Lax规则稍稍放宽，大多数情况也是不发送第三方Cookie，但是导航到目标网址的Get请求除外。
```
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  router.get('/test',async (ctx) => {
    ctx.cookies.set("age","22",{httpOnly:false,sameSite："strict"})
    ctx.body = ""
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))  
```

**总结：**
     
> CRSF攻击是攻击者利用用户的身份操作用户账号的一种方式。设计CSRF的防御方案必须先理解其原理和本质，而且和XSS防御相辅相成。

## 点击劫持(ClickJacking)
>***点击劫持***，是一种视觉上的欺骗手段。攻击者使用一个透明，不可见的iframe,覆盖在
一个网页上，然后诱使用户在该页面上进行操作，此时用户将在不知情的情况下点击透明的iframe页面。通过
调整iframe页面的位置，可以诱使用户恰好点击在iframe页面的一些功能性按钮上。

点击劫持攻击的演示：
```
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClickJacking</title>
    <style>
      iframe{
        opacity: 0;
        position: absolute;
        z-index: 2;
      }
      button{
        top:10px;
        left:190px;
        position: absolute;
        z-index: 1;
        width: 60px;
        background-color: #c09;
      }
    </style>
  </head>
  <body>
    <iframe src="http://www.emdoor.com/" width="800" height="600">
    </iframe>
    <button>Click Here</button>
  </body>
  </html>
```
* 当iframe半透明的时候，我们看到button其实覆盖在另一个网页，当我们点击button的时候其实是点击网页的某个操作：
  <img src="/notes/webSecurity/clickJacking/cj1.png" style="display:block;margin:0 auto"/> 

所以：
> ***点击劫持***，本质是一种视觉欺骗，顺着这些思路也出现了一些类似图片覆盖，拖拽等类似攻击

ClickJacking的防御：  
1. 使用JS禁止内嵌iframe
```
  <script>
    if(top.location != window.location){
      top.location = window.location
    }
  </script>
```
  <img src="/notes/webSecurity/clickJacking/cj2.png" style="display:block;margin:0 auto"/>  

**但是有很多办法可以绕过JS代码，比如H5中iframe的sandbox属性，IE中iframe的security属性等，都可以使JS代码失效**

2. 设置X-FRAME-OPTIONS禁止内嵌
```
  response.set("X-Frame-Options","DENY || SAME-ORIGIN || ...")
```

**总结：**
     
> ClickJacking相对于XSS和CSRF来说，因为需要诱使用户与页面产生交互行为，因此攻击成本高，在安全方面比较少见，
但还是不可不防。
