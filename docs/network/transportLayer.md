## 概述
传输层为 ***应用程序之间*** 提供 ***端到端*** 的逻辑通信。

## UDP 协议和 TCP 协议
1. **UDP（User Datagram Protocol）**
> UDP 是无连接的 （即不需要建立连接，减少了开销和发送数据的时延）   
> UDP 不提供可靠交付（即不需要维护复杂的连接状态）  
> UDP 是面向报文传输的（即应用层交给 UDP 多长的报文，UDP就照样发送）  
> UDP 支持 N 对 N 的交互通信  
> .....

2. **TCP（Transmission Control Protocol）**
> TCP 是面向连接的（即TCP三次握手）  
> TCP 提供可靠交付（即传输的数据无差错、不丢失、不重复）  
> TCP 一条连接只能连接通信两端唯一的端点（即套接字：IP + port）  
> TCP 面向字节流传输（即把数据拆分成一连串无结构的字节流）   
> TCP 提供全双工通信（即通信双方既是发送方也是接收方）     
> ......

## UDP 首部和 TCP 首部
1. **UDP数据报：（首部字段 + 数据字段）**

    <img src="/notes/network/transportLayer/udp.png" style="display:block;margin:0 auto"/>

    - 比较清晰明了不需要做笔记
2. **TCP报文段：（首部字段 + 数据字段）**

    <img src="/notes/network/transportLayer/tcp.png" style="display:block;margin:0 auto"/>

    - 序号（Sequence number）：是指本报文段第一个字节的序号，TCP连接中传送的字节流中的每一个字节都按顺序编号，主要是为了保证数据包按正确的顺序组装。  
    - 确认号（Acknowledgment number）：是期望收到对方下一个报文段的第一个数据字节的序号。  
    - 常用标记位：
      - 1.确认ACK: 当 ACK = 1时确认号字段才有效。也就是建立连接后传送报文段都必须把 ACK = 1。
      - 2.终断RST: 当 RST = 1时表示TCP连接出现异常终断，强制断开连接。
      - 3.同步SYN: 建立一个连接时用来同步的序号。当 SYN = 1 而 ACK = 0表明是连接请求报文，当同意建立连接则在响应报文中使 SYN = 1 和 ACK = 1。
      - 4.终止FIN：用来释放一个连接。当 FIN = 1表明此报文段的发送方的数据都已经发送完毕，并要求释放传输连接。
    - 窗口大小：指发送本报文段这一方目前的接收窗口大小（动态变化），这个窗口大小就是允许对方发送的数据量。总之就是接收方让发送方设置其发送窗口的依据。
    - 常用的选项：
      - 1.TCP的时间戳（TimeStamps）：计算往返时延RTT(Round-Trip Time)以及防止序列号回绕。
      - 2.MSS：规定一个最大报文段长度。
      - 3.SACK：出现报文段缺失时选择性确认。
      - 4.Window Scale：窗口缩放选项。
    
3. **Wireshake抓包TCP：**

    <img src="/notes/network/transportLayer/wireshark-tcp.png" style="display:block;margin:0 auto"/>

## TCP 的传输连接管理
1. **TCP 的三次握手连接**
  <img src="/notes/network/transportLayer/handshake.jpg" style="display:block;margin:0 auto"/>
    - 双方开始都处于 **CLOSED** 状态。服务端开始监听某个端口，进入了 **LISTEN** 状态。
    - 客户端主动发起连接，请求报文段中把首部的**SYN位 置为1**，自己变成 **SYN-SENT** 状态。【不能携带数据】
    - 服务端收到连接请求后，如果同意建立连接则向客户端发送确认。确认报文段中把首部的 **SYN位 和 ACK位 置为1**，自己变成 **SYN-RCVD** 状态。【不能携带数据】
    - 之后客户端再次向服务端给出确认。确认报文段中把 **ACK位 置为1**，自己变为 **ESTABLISHED** 状态。【ACK报文段可以携带数据】
    - 服务端接收到客户端确认后，也进入 **ESTABLISHED** 状态。

    **为什么不是二次握手呢？**  
      - 主要是为了防止已失效的连接请求报文段突然又传送给服务段，因为产生错误。
    > 异常情况：如果客户端发出的一个连接请求报文没有丢失，只是在某些网络结点长时间**滞留**了，直到连接释放后的某个时间才到达服务端。本来这是一个已经失效的报文段，但是服务端会误以为这是客户端发出一次新的连接请求，随后又同意建立连接。所以这就带来了连接资源的浪费了。

    **为什么不是四次握手呢？**
      - 三次握手已经足够确认客户端服务端发送和接收的能力，再多用处就不大了。

    **SYN Flood 攻击的原理？**
      - SYN Flood 攻击的原理就是客户端在短时间内伪造大量不存在的 IP 地址，向服务端疯狂发送 SYN 连接请求，服务端确认连接发送 SYN + ACK 等待客户端确认。由于客户端都是假IP，服务端就会得不到客户端的确认一直重发 SYN + ACK 报文，直到服务器瘫痪。 

2. **TCP 的四次挥手释放**
  <img src="/notes/network/transportLayer/release.jpg" style="display:block;margin:0 auto"/>
    - 双方开始都处于 **ESTABLISHED** 状态。
    - 客户端主动发出连接释放报文段，把释放报文段中首部的**FIN位 置为1**，自己变成 **FIN-WAIT-1** 状态。
    - 服务端收到释放报文段后发出确认，确认报文段中把首部的 **ACK位 置为1**，自己变为 **CLOSE-WAIT** 状态。【半关闭状态，即客户端不向服务端发送数据了】
    - 客户端收到服务端的确认后，自己变为 **FIN-WAIT-2** 状态，接着等待服务端发出的连接释放报文段。
    - 服务端发出连接释放报文段，把释放报文段中首部的 **FIN位 置为1**，自己进入 **LAST-ACK** 状态。
    - 客户端接收到释放报文段后发出确认，确认报文段中把首部的 **ACK位 置为1**，自己变为 **TIME-WAIT** 状态。
    - 服务端接收到客户端确认后变为 **CLOSED** 状态，而客户端需等待 **2个MSL** 后才进入 **CLOSED** 状态。

    **为什么客户端CLOSED前需等待2MSL（最长报文段寿命）**  
      - 1. 为了保证客户端发送的最后一个 **ACK 报文段**能够到达服务端。
    > 异常情况：如果客户端发送的最后这个 ACK 报文段丢失了，就会造成 LAST-ACK 状态的服务端收不到对客户端发送的 FIN + ACK 报文段的确认。服务端就会超时重传这个 FIN + ACK 报文段，如果客户端发送最后一个 ACK 报文段就直接进入 CLOSED 状态就无法接收服务端重传的报文了，服务端就无法按照正常步骤进入 CLOSED 状态。如果有这个等待2MSL，客户端就可以重传一次确认，最后都可以正常进入 CLOSED 状态。

      - 2. 确保下一个新的连接中不会出现这次连接的报文段。
    > 经过2MSL可以使得本连接持续的时间内所产生的所有报文段都从网络中消失，这样下个新的连接中不会出现这种旧的连接请求报文段。

## TCP 可靠传输的实现
1. **滑动窗口（字节单位）** 

    示例：假如A要向B发送一个文件：  
    - A的发送窗口是由B的接受窗口长度决定的。  
    - 在没有收到B确认收到之前，A不能删掉滑动窗口内的内容（防止丢包需要重传）。  
    - A可以持续给B发送数据包（每个包大小随机），直到A的滑动窗口内数据包都发了。

      <img src="/notes/network/transportLayer/slider1.png" style="display:block;margin:0 auto"/>

    - B收到后给A发确认 ACK，确认号是下一个应该发送的字节的序号，A收到后就可以滑动窗口到对应的位置。例如B确认号 ack = 7，那么A的滑窗可以移动到 7 位置，1 - 6 删除，21 - 26 可以发送。  
    - B收到 1 - 6 之后，B的接收窗口继续滑动接收。此时B的应用程序可以读取 1 - 6 的数据。

      <img src="/notes/network/transportLayer/slider2.png" style="display:block;margin:0 auto"/>

    - 然后按上述情况继续滑动接收。假如出现丢包情况，例如 7 - 9 数据包丢失造成字节流不连续，B会发送给A的确认号是 ack = 7，又因为 10 - 12 接收到了，因此B发送给A的确认中还会有个 SACK(选择性确认)。所以A就会重新发丢失的数据包。

      <img src="/notes/network/transportLayer/slider3.png" style="display:block;margin:0 auto"/>

2. **超时重传**
> TCP每发送一个报文段，就对这个报文段设置一次计时器。只要计时器设置的重传时间到了但是还没收到确认，就要重传这一段报文。
    
  超时重传时间（RTO）不是一个固定的值，一般会略大于一些算法得出的加权平均往返时间。

## TCP 的流量控制
  > 流量控制就是让发送方的发送速率不要太快，要让接收方来得及接收。利用的就是滑动窗口机制。
  
  通过实时调整滑窗尺寸的大小(可以是0)来实现流量控制。接收端主动调整滑窗大小，发送端根据接收端发送的报文调整发送窗口。 
  
## TCP 的拥塞控制
  > 如果网络已经出现拥塞，如果不处理拥塞，那么延时增加，出现更多丢包，触发发送方重传数据，加剧拥塞情况，继续恶性循环直至网络瘫痪。
  > TCP 的拥塞控制办法就是拥塞发生前，避免流量过快增长拖垮网络；拥塞发生时，唯一的选择就是降低流量。

主要完成拥塞控制方法：

1. **慢开始和拥塞避免**

2. **快重传和快恢复**