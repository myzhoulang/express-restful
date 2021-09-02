# mongodb CRUD

## 新增（Create）

- insertOne (插入一条文档)

  ```js
    // collection: 集合名称 相当mysql中的表
    // document: 插入的文档数据 (json)
    // writeConcern: 指定安全写级别 { w: <value>, j: <boolean>, wtimeout: <number> } 可选
    语法：

    db.<collection>.insertOne(
      <document>,
      {
        writeConcern: <writeConcern>
      }
    )

    案例：
    db.users.insertOne({
      name: 'bobs',
      age: 19
    })

  ```

- insertMany (插入多条文档)

  ```js
    // collection: 集合名称 相当mysql中的表
    // [document]: 插入的一组文档数据
    // writeConcern: 指定安全写级别 { w: <value>, j: <boolean>, wtimeout: <number> } 可选
    // ordered: 是否需要有序插入 默认有序插入
    //   1. 无序插入的话可以得到优化
    //   2. 无序插入的时候 其中一个文档插入错误不会影响到其他文档的插入
    语法：

    db.<collection>.insertOne(
      [<document1>,<document2>...],
      {
        writeConcern: <writeConcern>
        ordered: <boolean>
      }
    )

    案例：
    db.users.insertMany([
      {name: 'bobs',age: 19}，
      {name: 'a',age: 29}，
    ])

  ```

- insert (insertOne 和 insertMany 的结合)

## 查询 (Read)

### find 操作符

- 比较操作符

  > 比较操作符：
  >
  > `$eq`(相等)、`$ne`(不等)、 `$gt`(大于)、`$lt`(小于)、`$gte`(大于等于)、`$lte`(小于等于)、`$in`(包含)、`$notin`(不包含)。

- 逻辑操作符

  > 逻辑操作符：
  >
  > `$not`(条件不成立)、`$and`(多条件与)、`$or`(多条件或)、`$nor`(多条件都不成立)。

- 字段操作符

  > 字段操作符：
  >
  > `$exists`(字段存在)、`$type`(字段类型比较)

- 数组操作符

  > 数组操作符：
  >
  > `$all`、`$eleMatch`

- 运算操作符

  > 运算操作符：
  >
  > `$regex`(正则表达式)
