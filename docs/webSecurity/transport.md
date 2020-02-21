## 介绍
日常生活中，上网的直观感受就是我打开浏览器，输入一个网址，然后我立刻就能看到网页。这是站在用户的角度来看上网，但在这个“上网”的过程中，隐藏了非常多的技术细节。
<img src="/notes/webSecurity/network/server.png" style="display:block;margin:0 auto"/>

我们可以测试一下访问百度服务器中间经过的节点：
<img src="/notes/webSecurity/network/netNode.png" style="display:block;margin:0 auto"/>

>所以说在访问服务器的过程中，我们的HTTP请求数据会以明文的形式传递到每个节点，**流量劫持**就是在这些环节当中，对数据进行偷窃、篡改，甚至转发流量进行攻击的这样一类行为。

## DNS劫持
> DNS劫持是互联网攻击的一种方式，通过攻击域名解析服务器（DNS），或伪造域名解析服务器（DNS）的方法，把目标网站域名解析到错误的地址从而实现用户无法访问目标网站的目的。 

常见的DNS劫持方法：
1. **恶意软件实现篡改用户电脑hosts文件**

2. **入侵DNS服务器**

3. **在中间链路设备中修改报文（比如路由器）**

针对上述DNS劫持抵御办法：
1. **ipconfig /flushdns**
```
  ipconfig /flushdns 清理dns缓存
```
结果：
  <img src="/notes/webSecurity/network/flushDNS.png" style="display:block;margin:0 auto"/>

2. **绕过运营商DNS解析**  
    - 使用自己的域名解析服务器
    - 将解析好的域名以IP的形式发送

3. **DNS over TLS，DNS over HTTP(S)**  
  因为DNS解析是UDP传输信息不加密，中间链路设备可能篡改内容造成钓鱼诈骗和网络攻击。**采用TLS或者HTTP(S)加密传输数据**（本小白还没实践过，未来实践后再来补充）

## HTTP劫持
> HTTP劫持原理基本上也是因为HTTP属于明文协议，中间链路上的任意设备，都可以篡改内容。

HTTP劫持测试：
1. 用户正常请求http://www.emdoor.com/，banner图正常应该是如下：
  <img src="/notes/webSecurity/network/http-proxy2.png" style="display:block;margin:0 auto"/>

2. 使用Fiddler代理工具篡改请求数据，替换成本地图片： 
  <img src="/notes/webSecurity/network/http-proxy1.png" style="display:block;margin:0 auto"/>

3. 最终显示的是我们劫持修改了的图片：
  <img src="/notes/webSecurity/network/http-proxy3.png" style="display:block;margin:0 auto"/>


HTTP劫持的防御：   
  - **不管使用CSP还是SRI校验资源，但是中间人都可以在HTTP明文中移除相关属性。所以比较理想的方案就是迁移到HTTPS上**

## HTTPS劫持
> HTTPS传输协议即在HTTP传输数据过程中对报文进行加密（SSL/TLS）。一般来说全站上HTTPS能防止大部分劫持，但是HTTPS并不一定是绝对安全的，加密的数据也是可以被劫持的。

加密的HTTPS事务：
  <img src="/notes/webSecurity/network/HTTPS.png" style="display:block;margin:0 auto"/>

**在SSL/TLS握手时客户端和服务器会进行密钥协商然后对数据加密。因此在密钥协商时要确认身份，所以需要引入一个第三方信任机制，即证书颁发机构（CA, Certificate Authority）颁发数字证书。** 

> TIP: SSL/TLS使用方式，握手过程可能会更复杂些

HTTPS是如何确定服务器的：
  <img src="/notes/webSecurity/network/CA.png" style="display:block;margin:0 auto"/>

常见HTTPS的劫持：  
1.**安装伪造的CA证书，然后被代理服务器劫持**  
  - 这样代理服务器可以在中间篡改被劫持浏览器传输的数据

2.**破解SSL/TLS加密网络数据包**