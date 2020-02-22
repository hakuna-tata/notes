## 注入攻击

## 密码加密
> 密码是最常见的一种认证手段，持有正确密码的人被认为是最可信的。为了保证密码的安全，一般来说必须以不可逆的加密算法，或者是单向散列函数算法，加密后存储在数据库中。

目前广泛使用的破解MD5密码的方法是**彩虹表(穷举法):**(收集尽可能多的密码明文和明文对应的MD5值)   

密码泄露防御：  
1. **增加明文的复杂度：**
```javascript
  // Salt为随机字符串保存在服务器配置文件中
  Sha256(Sha1(MD5(Username + Password + Salt)))
```

## 文件上传漏洞
> 文件上传漏洞是指用户上传了一个可执行的脚本文件，并通过此脚本文件获得了执行服务器端命令的能力。文件上传是一个很正常的业务需求，问题是文件上传后，
服务器怎么处理，解释文件。如果处理的逻辑不够安全会早成严重的后果

文件上传漏洞演示：

客户端上传文件：
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

服务端开启服务
```javascript
  const Koa = require("koa")
  const Router = require("koa-router")
  const app = new Koa()
  const router = new Router()

  router.all('/*',async(ctx,next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    await next()
  })

  router.post('/test',async(ctx) => {
    ctx.status = 200
    ctx.body = {
      code: 0,
    }
  })

  app.use(router.routes())

  app.listen(8000, () => console.log('[Server] starting at port 8000'))
```

设计安全的文件上传：

>总结：文件上传往往与代码执行联系在一起，因此对于业务中要用到的上传功能，都应该进行严格的检查。