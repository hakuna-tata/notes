## 概述
**传输层安全性协议**（TLS），及其前身**安全套接层**（SSL）是一种安全协议，目的是为互联网通信提供安全及数据完整性保障，由此产生了 **HTTPS**。
> HTTPS = HTTP + TLS/SSL  

## TLS/SSL 的依赖
1. **非对称加密（身份验证和秘钥协商）：RSA，ECC，DH**  
2. **对称加密（信息加密）：AES，DES，RC4**  
3. **散列算法（校验信息完整性）：MD5，SHA**  

## TLS 1.2 握手过程
1. **Wireshark抓包TLS：**

    <img src="/notes/network/securityLayer/wireshark-tls.png" style="display:block;margin:0 auto"/>

2. **握手过程：**
