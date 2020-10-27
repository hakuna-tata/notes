## 概述
Docker 网络中比较典型的网络模式有以下四种，这四种网络模式基本满足单机容器的所有场景。    
- **1. null 空网络模式**  
- **2. host 主机网络模式**  
- **3. container 网络模式**   
- **4. bridge 桥接模式**

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

## host 主机网络模式
> 1. host 主机网络模式的容器不会创建新的网络配置和 Net Namespace；  
> 2. 该进程直接共享主机的网络配置，直接使用主机的网路信息，但是在容器内监听的端口也直接占用宿主机的端口；  
> 3. 除了网络共享宿主机的网络外，但其他的包括进程、文件系统、主机名等都是与主机隔离的。  

**验证：**  
- 创建一个 host 网络模式的容器，发现容器内的网络环境跟宿主机完全一致
```
[root@liujianfeng ~]# docker run -it --name testHostNet --net=host my_ecs:v1

[root@liujianfeng /]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP qlen 1000
    link/ether 52:54:00:52:32:88 brd ff:ff:ff:ff:ff:ff
    inet 172.16.0.13/20 brd 172.16.15.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::5054:ff:fe52:3288/64 scope link
       valid_lft forever preferred_lft forever
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP
    link/ether 02:42:f5:85:32:6a brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:f5ff:fe85:326a/64 scope link
       valid_lft forever preferred_lft forever
25: vethc0dc853@if24: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue master docker0 state UP
    link/ether fa:0c:1a:d1:2b:8e brd ff:ff:ff:ff:ff:ff
    inet6 fe80::f80c:1aff:fed1:2b8e/64 scope link
       valid_lft forever preferred_lft forever
```

- 在宿主机中查看一下刚创建 host 网络模式的容器
```
[root@liujianfeng ~]# docker network inspect host
[
    {
        "Name": "host",
        "Id": "a6a183c157120e63deb1f796bf2f043af123a6e424faba262c972df8830ba299",
        "Created": "2020-08-29T19:40:26.384774785+08:00",
        "Scope": "local",
        "Driver": "host",
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
            "d525a4210f5beb9877420796c7efa2bab4974e0445e20c827a46e4f4be952d0b": {
                "Name": "testHostNet",
                "EndpointID": "9d8f21e9dcb3636e5a41cec21ab0ab853977bedff5ba75c17be9a515f0a0364c",
                "MacAddress": "",
                "IPv4Address": "",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```
> 用途： 如果容器内的网络并不是希望永远跟主机是隔离的，有些基础业务需要创建或更新主机的网络配置，所以主机网络模式运行的容器才能够修改主机网络。

## container 网络模式


## bridge 桥接模式
>  Docker 本地网络实现利用了 Linux 的 Network Namespace 和 Virtual Ethernet Pair (veth pair)