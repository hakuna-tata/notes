## 注入攻击

## 文件上传漏洞
> 文件上传漏洞是指用户上传了一个可执行的脚本文件，并通过此脚本文件获得了执行服务器端命令的能力。文件上传是一个很正常的业务需求，问题是文件上传后，
服务器怎么处理，解释文件。如果处理的逻辑不够安全会早成严重的后果

文件上传漏洞演示：

* 客户端上传：
```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件上传漏洞</title>
  </head>
  <body>
    <input type="file" id="picFile">
    <script>
      function $ajax(options){
        let opt = Object.assign({
          url: "",
          method: "post",
          headers: {},
          data: null
        },options)
        let xhr = new XMLHttpRequest
        xhr.open(opt.method,opt.url,true)
        Object.keys(opt.headers).forEach(key => {
          xhr.setRequestHeader(key,opt.headers[key])
        })
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
            if(/^(2|3)\d{2}$/.test(xhr.status)){
              return xhr.responseText
            }
          }
        }
        xhr.send(opt.data)
      }
      picFile.onchange = function(){
        let fl = picFile.files[0]
        let formData = new FormData()
        formData.append("chunk",fl)
        formData.append("filename",fl.name)
        $ajax({
          url:"http://127.0.0.1:8000/test",
          data:formData
        })
      }
    </script>
  </body>
  </html>
```

* 服务端保存文件
```javascript
  const fs = require("fs")
  const path = require("path")
  const Koa = require("koa")
  const Router = require("koa-router")
  const koaBody = require('koa-body')
  const app = new Koa()
  const router = new Router()

  app.use(koaBody({
    multipart: true
  }))

  router.all('/*',async(ctx,next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    await next()
  })

  router.post('/test',async(ctx) => {
    const file = ctx.request.files
    const reader = fs.createReadStream(file.chunk.path)
    let filePath = path.join(__dirname,"upload/") + `/${file.chunk.name}`
    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)
    ctx.body = "上传成功"
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```

* 上传结果：
  <img src="/notes/webSecurity/upload/upload.png" style="display:block;margin:0 auto"/>

**所以也就说当我们客户端需要上传的是图片然而上传的却是注入脚本的时候就会出现严重后果。如果用户通过url访问上传的脚本并执行，这时候整个服务器就完全暴露了。**

设计安全的文件上传：
1. **文件上传的目录设置为不可执行**
    - 杜绝了脚本执行的可能（放到独立的存储做静态文件处理，读取文件返回）

2. **判断文件类型(只能简单防御)**
    - 判断文件类型时结合MIME TYPE，后缀检查等方式
    - 文件类型检查中用白名单过滤方式 

3. **权限控制**
    - 可写与可执行互斥  

>总结：文件上传往往与代码执行联系在一起，因此对于业务中要用到的上传功能，都应该进行严格的检查。


## 重放攻击
> 重放攻击(Replay Attacks)是指攻击者发送一个目的主机已接收过的包，来达到欺骗系统的目的，主要用于身份认证过程，破坏认证的正确性。重放攻击可以由发起者，也可以由攻击者拦截并重发该数据。攻击者利用网络监听或者其他方式盗取认证凭据，之后再把它重新发给认证服务器。

举个我项目中一个例子来说：  
- 当用户A赠送点券给用户B的时候，用户A向服务端发起了请求（携带了签名等数据），服务端接收到了请求并将点券转给了用户B。
- 当这个请求被某个攻击者在中间链路层拦截了，拦截者直接将请求原封不动反复发送给服务端，服务端一直收到请求并一直将点券转给用户B。
- 所以攻击者无须破解这些数据，只需要将同样的请求重复发给服务器就可以达到欺骗的目的。

网上重放攻击原理图大概流程：
<img src="/notes/webSecurity/replay-attack/replay-attack.jpg" style="display:block;margin:0 auto"/>

常见防御重放攻击的方法：
1. **加时间戳**  
  - 每次请求的时候需要将时间戳携带至服务端检查。但是既然攻击者可以重放请求，那么也可以修改时间戳欺骗服务器，所以并不是很好的防御办法。

2. **签名 + 时间戳**  
  - 在请求中带上时间戳，并且把时间戳也作为签名的一部分(防止攻击者篡改)
  <img src="/notes/webSecurity/replay-attack/sign-timeStamp.png" style="display:block;margin:0 auto"/>

3. **HTTPS**
  - 对于HTTPS，每个socket连接都需要验证证书，交换秘钥。攻击者截取请求重新发送，但是socket不同秘钥也不同，就无法解析请求，所以HTTPS本身就是防止重放攻击的。

## 密码加密
> 密码是最常见的一种认证手段，持有正确密码的人被认为是最可信的。为了保证密码的安全，一般来说必须以不可逆的加密算法，或者是单向散列函数算法，加密后存储在数据库中。

目前广泛使用的破解MD5密码的方法是**彩虹表(穷举法):**(收集尽可能多的密码明文和明文对应的MD5值)   

密码泄露防御：  
1. **增加明文的复杂度：**
```javascript
  // Salt为随机字符串保存在服务器配置文件中
  Sha256(Sha1(MD5(Username + Password + Salt)))
```


## 拒绝服务攻击
> 拒绝服务攻击英文翻译为DoS（Denial of Service）。一般指的是利用合理的请求造成资源过载（发送大量数据包），导致服务不可用。

- 缺少网络层，应用层DDoS实践经验，未来补充