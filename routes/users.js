var mongodb = require('./db');
/*var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 30,
  host            : 'localhost',
  user            : 'root',
  password        : xxxx
});

pool.query('SELECT * FROM zd.alga_cs;', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows);
});*/

function User(user) {
  this.name = user.name;
  this.password = user.password;
}
module.exports = User;
//保存数据
User.prototype.save = function save(callback) {
  // 存入 Mongodb 的文档
  var user = {
    name: this.name,
    password: this.password
  };
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 users 集合
    db.collection('user_log', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 为 name 属性添加索引
      collection.ensureIndex('name', {unique: true});
      // 写入 user 文档
      collection.insert(user, {safe: true}, function(err, user) {
        mongodb.close();
        callback(err, user);
      });
    });
  });
};
//获取单条数据
User.get = function get(username, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 users 集合
    db.collection('user_log', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 查找 name 属性为 username 的文档
      collection.findOne({name: username}, function(err, doc) {
        mongodb.close();
        if (doc) {
          // 封装文档为 User 对象
          var user = new User(doc);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};

//获取数据集合
User.getList = function getList(callback){
  mongodb.open(function (err, db) {
    if (err){
      return callback(err);
    }
    db.collection('user_log',function(err, collection){
      if (err){
        mongodb.close();
        return callback(err);
      }
      collection.find().toArray(function(err,data){
        //异常处理
        if(err){
          return callback(err);
        }
        mongodb.close();
        console.log(data);
        callback(err,data);
      });
    })
  });
}