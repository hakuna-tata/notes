## 概述
在实际业务场景中经常需要对数据进行持久化（MySQL，Kafka），因此 Docker 拥有了 Volume 的概念。

## Docker 卷的操作

在 Docker 启动时使用 -v 的方式指定容器内需要被持久化的路径，Docker 会自动为我们创建卷，并且绑定到容器中。

**验证：**   
```shell
[root@liujianfeng /]# docker container ls
CONTAINER ID        IMAGE               COMMAND               CREATED             STATUS              PORTS                  NAMES 
77ac5db8347b        1a24cd5f36de        "/usr/sbin/sshd -D"   6 weeks ago         Up 6 weeks          0.0.0.0:2222->22/tcp   my_ecs
[root@liujianfeng /]# docker volume ls
DRIVER              VOLUME NAME

// 启动了 nginx 容器，使得 Docker 自动生成一个卷并且绑定到容器的 /usr/share/nginx/html 目录中
[root@liujianfeng /]# docker run -d --name=nginx-volume1 -v nginx-volume1:/usr/share/nginx/html nginx
b04c48eb6859b3649c0b4b7818965b0eb1e7d54837d23e29cd1921b93eb81b51
[root@liujianfeng /]# docker run -d --name=nginx-volume2 -v nginx-volume2:/usr/share/nginx/html nginx
f197f7af68843b85fd64f361ecf73e710fbb566406ef5cec49817e245c76935e
[root@liujianfeng /]# docker container ls
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES       
f197f7af6884        nginx               "/docker-entrypoint.…"   10 seconds ago      Up 9 seconds        80/tcp                 nginx-volume2
b04c48eb6859        nginx               "/docker-entrypoint.…"   19 seconds ago      Up 18 seconds       80/tcp                 nginx-volume1
77ac5db8347b        1a24cd5f36de        "/usr/sbin/sshd -D"      6 weeks ago         Up 6 weeks          0.0.0.0:2222->22/tcp   my_ecs      
[root@liujianfeng /]# docker volume ls
DRIVER              VOLUME NAME  
local               nginx-volume1
local               nginx-volume2

// 删除 nginx 容器验证数据是否持久化
[root@liujianfeng /]# docker rm -f f197f7af6884 b04c48eb6859
f197f7af6884
b04c48eb6859
[root@liujianfeng /]# docker container ls
CONTAINER ID        IMAGE               COMMAND               CREATED             STATUS              PORTS                  NAMES 
77ac5db8347b        1a24cd5f36de        "/usr/sbin/sshd -D"   6 weeks ago         Up 6 weeks          0.0.0.0:2222->22/tcp   my_ecs
[root@liujianfeng /]# docker volume ls
DRIVER              VOLUME NAME  
local               nginx-volume1
local               nginx-volume2
```
> 可以发现 Docker 卷后我们的数据并没有随着容器的删除而消失（包括对文件的增删改）。

## 主机与容器之间数据共享
在启动容器的时候添加 -v 参数格式为：-v HOST_PATH:CONTIANAER_PATH。

## 容器与容器之间数据共享

**验证：** 
```shell
// 创建一个共享消费者日志的数据卷
[root@liujianfeng /]# docker volume ls
DRIVER              VOLUME NAME
[root@liujianfeng /]# docker volume create consumer-log
consumer-log
[root@liujianfeng /]# docker volume ls
DRIVER              VOLUME NAME 
local               consumer-log

// host 窗口
[root@liujianfeng /]# docker run --mount source=consumer-log,target=/tmp/log --name=producer -it ubuntu:16.04
root@161c0c92aa39:/#

// host 窗口
[root@liujianfeng ~]# docker run --name=consumer -it --volumes-from producer ubuntu:16.04
root@191d77bda302:/# 

// producer 窗口
root@161c0c92aa39:/# cat <<EOF >/tmp/log/mylog.log
> Hello, My log.
> EOF

// consumer 窗口
root@191d77bda302:/# cat /tmp/log/mylog.log
Hello, My log

// host 窗口
[root@liujianfeng /]# docker volume  ls
DRIVER              VOLUME NAME 
local               consumer-log
[root@liujianfeng /]# docker volume inspect consumer-log
[
    {
        "CreatedAt": "2020-11-01T14:16:57+08:00",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/consumer-log/_data",
        "Name": "consumer-log",
        "Options": {},
        "Scope": "local"
    }
]
[root@liujianfeng _data]# cd /var/lib/docker/volumes/consumer-log/_data/ && ls
mylog.log
[root@liujianfeng _data]# cat mylog.log 
Hello, My log
```
> 可以看到从 producer 容器写入的文件内容会自动出现在 consumer 容器中，证明成功实现了两个容器间的数据共享。