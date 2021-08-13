docker run \
--name mongodb \
-p 27017:27017 \
-v /data/mongo/conf:/data/configdb \
-v /data/mongo/data:/data/db \
-v /data/mongo/logs:/data/log \
-d mongo --configsvr

docker run -d --name mongodb -p 27017:27017 \
 -v /Users/apple/data/mongo/conf/mongod.conf:/etc/mongod.conf \
 -v /Users/apple/data/mongo/logs:/data/log \
 -v /Users/apple/data/mongo/data:/data/db mongo --config /etc/mongod.conf

docker run --name redis -p 6379:6379 -v /redis:/data -d redis

mongo 127.0.0.1:27017/auth -u admin -p 123456

db.createUser({user: 'admin', pwd: '123456', roles: [{role: 'userAdmin', db: 'auth'},{role: 'dbOwner', db: 'auth'},{role: 'readWrite', db: 'auth'}]})

db.updateUser('auth', {user: 'admin', pwd: '123456', roles: [{role: 'userAdmin', db: 'auth'},{role: 'dbOwner', db: 'auth'},{role: 'readWrite', db: 'auth'}]})

db.createUser(
{ user: "admin",
customData:{description:"superuser"},
pwd: "admin",
roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
}
)

mongodb://auth:123456@47.100.111.243:27017/auth?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false

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
