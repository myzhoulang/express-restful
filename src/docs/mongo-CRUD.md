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
