## 概述
Docker 网络中比较典型的网络模式有以下四种，这四种网络模式基本满足单机容器的所有场景。    
- **1. null 空网络模式**  
- **2. bridge 桥接模式**  
- **3. host 主机网络模式**  
- **4. container 网络模式**

## null 空网络模式

## bridge 桥接模式
>  Docker 本地网络实现利用了 Linux 的 Network Namespace 和 Virtual Ethernet Pair (veth pair)