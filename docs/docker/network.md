## 概述
Docker 网络中比较典型的网络模式有以下四种，这四种网络模式基本满足单机容器的所有场景。    
- **1. null 空网络模式**  
- **2. bridge 桥接模式**  
- **3. host 主机网络模式**  
- **4. container 网络模式**

## null 空网络模式
> null 网络模式的容器就像一个没有联网的电脑，处于一个相对较安全的环境。容器还是拥有自己独立的 Net Namespace，
但是此时的容器并没有任何网络配置。 在这种模式下，Docker 除了为容器创建了 Net Namespace 外，没有创建任何网卡接口、IP 地址、路由等网络配置。

**验证：**  
- 使用 docker run 命令创建容器时添加 --net=none 参数启动一个空网络模式的容器
```
[root@liujianfeng ~]# docker run -it --net=none my_ecs:v1
```
- 在宿主机中查看一下刚创建 null 网络模式的容器，发现 MAC、IP 地址都是空的
```
[root@liujianfeng ~]# docker network inspect none
[
    {
        "Name": "none",
        "Id": "899c6ed4860e1c69e590ed75f8a0dd81443908f3c393c5c7b722f1487e0c2609",
        "Created": "2020-08-29T19:40:26.366688902+08:00",
        "Scope": "local",
        "Driver": "null",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": []
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "71901532618ba308bd9462124ead5e8a04a6569fff1dc026b16eb20edb04c57e": {
                "Name": "wonderful_babbage",
                "EndpointID": "d1a711b05d94059a0b17cec6478b284338fa424d1d345752856137fde321175d",
                "MacAddress": "",
                "IPv4Address": "",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]

[root@liujianfeng ~]# docker ps
CONTAINER ID        IMAGE               COMMAND               CREATED              STATUS              PORTS                  NAMES
71901532618b        my_ecs:v1           "/bin/bash"           About a minute ago   Up About a minute                          wonderful_babbage
77ac5db8347b        1a24cd5f36de        "/usr/sbin/sshd -D"   6 weeks ago          Up 6 weeks          0.0.0.0:2222->22/tcp   my_ecs
```
- 进入容器内查看网络配置信息，发现除了 Net Namespace 自带的 lo 网卡并没有创建任何虚拟网卡
```
[root@09b888e82ba0 /]# ifconfig
lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0  
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:0 (0.0 b)  TX bytes:0 (0.0 b)
```
> 用途：可能处理一些保密数据，出于安全考虑，需要一个隔离的网络环境执行一些纯计算任务。

## bridge 桥接模式
>  Docker 本地网络实现利用了 Linux 的 Network Namespace 和 Virtual Ethernet Pair (veth pair)