1. 拉取`redis`镜像

   ```bash
   docker pull redis
   ```

2. 下载配置`redis`配置文件

   > 可以从[redis官方网站](http://download.redis.io/redis-stable/redis.conf)下载，下载完成后根据需求修改配置文件。一般主要修改一下配置：
   >
   > * 注释选项`bind 127.0.0.1 -::1`  使`redis`可以外部访问
   > * 配置选项`requirepass` 作为密码
   > * 配置选项 `appendonly yes`

3. 创建本地和`docker`映射目录

   ```bash
   mkdir /zhoulang/db/auth-redis
   mkdir /zhoulang/db/auth-redis/data
   ```

4. 将配置文件拷贝到`redis`目录

5. 使用`docker`启动`redis`

   ```bash
   docker run -d --name auth-redis -p 6379:6379 \
   -v /zhoulang/db/auth-redis/redis.conf:/etc/redis/redis.conf \
   -v /zhoulang/db/auth-redis/data:/data redis redis-server /etc/redis/redis.conf --appendonly yes
   ```

   

