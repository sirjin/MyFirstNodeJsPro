var express = require('express');
var http = require('http');
var router = express.Router();
var crypto = require('crypto');
var User = require('./users');

/**
 * 所有页面
 */
router.all('/', function(req, res, next) {
  res.render('test',{ title:'首页',body:'单纯的是个首页'});
});

/**
 * 已登录   重定向
 */
router.get('/isLogin',function (req,res) {
  res.render('index',{title:'登录成功',body: '进入session中了，可是为什么呢？'});
});

/**
 * 登录页面跳转
 */
router.get('/login',function(req,res){
  if(req.session.user){
    return res.redirect('/isLogin');
    //res.send("给出一点什么");
  }
  res.render('login',{ title:'用户登录'});
});

router.post('/login',function(req,res){
  if(req.body['username']==null||req.body['username']==''||req.body['password']==null||req.body['password']==''){
    //res.render('error',{message:'输入内容不得为空',error:null});
    return res.json({success : false,msg : '输入内容不得为空'});
  }else{
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.body['username'],function(err, user){
      console.log(user);
      if (!user)
        err = 'Username is not exists.';
      else if(user.password != password){
        err = '嘿嘿，密码输入错误.';
      }
      if (err) {
        //res.render('error', {message:err,error:err});
        return res.json({success:false,msg:err});
      }else{
        req.session.user = user;
        res.render('index', { title:'登录成功',body: '说真的，虽然你登录成功了，但是我没办法给你展示内容'});
      }
    });
  }
});

/**
 * 注册页面跳转
 */
router.get('/reg',function(req,res){
  res.render('reg',{ title:'用户注册'});
});

/**
 * 用户注册操作
 */
router.post('/reg',function (req,res) {
  //检验用户两次输入的口令是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    res.render('error',  {message:'两次输入的口令不一致'});
    //return res.redirect('/reg');
  }
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  var newUser = new User({
    name: req.body.username,
    password: password
  });
  //检查用户名是否已经存在
  User.get(newUser.name, function(err, user) {
    if (user)
      err = 'Username already exists.';
    if (err) {
      res.render('error', {message:err,error:err});
      return;
      //return res.redirect('/reg');
    }
    //如果不存在则新增用户
    newUser.save(function(err) {
      if (err) {
        res.render('error', {message:err,error:err});
        return;
        //return res.redirect('/reg');
      }
      //req.session.user = newUser;
      res.render('index', { title:'标题',body: '真的，你注册成功了，取数据库看看呢'});
      //res.redirect('/');
    });
  });
});

/**
 * 遍历数据库数据
 */
router.get('/list',function (req,res) {
  User.getList(function(err,data){
    if (data.length<=0){
      err = "Array is null.";
    }
    if (err){
      res.render('error',{message:err,error:err});
    }else{
      res.render('list',{listitem:data});
    }
  });
});

/* GET home page. */
router.get('/:xxx', function(req, res, next) {
  res.render('index', { title:'标题',body: '我只是一个带参测试：' +req.params.xxx});
});

module.exports = router;