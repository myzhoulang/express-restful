docker run \
--name mongodb \
-p 27017:27017 \
-v /data/mongo/conf:/data/configdb \
-v /data/mongo/data:/data/db \
-v /data/mongo/logs:/data/log \
-d mongo --configsvr

docker run -d --name mongodbt -p 27017:27017 \
 -v /data/mongo/conf/mongod.conf:/etc/mongod.conf \
 -v /data/mongo/logs:/data/log \
 -v /data/mongo/data:/data/db mongo --config /etc/mongod.conf

docker run --name redis -p 6379:6379 -v /redis:/data -d redis

mongo 127.0.0.1:27017/auth -u admin -p 123456

db.createUser({user: 'admin', pwd: '123456', roles: [{role: 'userAdmin', db: 'auth'},{role: 'dbOwner', db: 'auth'},{role: 'readWrite', db: 'auth'}]})

db.updateUser(
'zhoulang',
{
pwd: '123456',
roles: [
{role: 'userAdmin', db: 'auth'},
{role: 'dbOwner', db: 'auth'},
{role: 'readWrite', db: 'auth'},
{role: 'userAdmin', db: 'admin'},
{role: 'dbOwner', db: 'admin'},
{role: 'readWrite', db: 'admin'}
]}
)
