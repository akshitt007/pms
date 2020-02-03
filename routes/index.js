var express = require('express');
var router = express.Router();
var userModule = require('../module/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
 



function checkEmail(req,res,next){
  var email =req.body.email;
  var checkExistEmail = userModule.findOne({email:email});
  checkExistEmail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('sign_up', { title: 'sign up page', msg: 'Email Alraedy exist'});
    }
    next();
  })
  
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login Page', msg :'' });
});

router.post('/', function(req, res, next) {

  var email =req.body.email;
  var password =req.body.password;
  var username =req.body.name;
  var checkExistEmail = userModule.findOne({email:email});
  checkExistEmail.exec((err,data)=>{
    if(err) throw err;
    
    var getUserID = data._id;


    var getPassword = data.password;
    if(bcrypt.compareSync(password,getPassword)){
       var token =jwt.sign({userID: getUserID},'loginToken');
       localStorage.setItem('userToken', token);
      
     res.redirect('/dashboard');
    }
    else{

      res.render('index', { title: 'Login Page', msg: 'invalid username or password' });
    }
    
});
});
router.get('/signup', function(req, res, next) {
  res.render('sign_up', { title: 'sign up page', msg: '' });
});

router.post('/signup',checkEmail, function(req, res, next) {

  var username =req.body.name;
  var email =req.body.email;
  var password =req.body.password;
  var confirm_password =req.body.confirm_password;
  if(password!=confirm_password){
    return res.render('sign_up', { title: 'sign up page', msg: 'password not match!'});
  }
  
else{
  password=bcrypt.hashSync(req.body.password,10);
  var userDetails = new userModule({
    username:username,
    email:email,
    password:password

  });

  userDetails.save((err,doc)=>{
    if(err) throw err;

    return res.render('sign_up', { title: 'sign up page', msg: 'user registered successfully'});
  })
}
 
});

router.get('/passwordCategory', function(req, res, next) {
  res.render('password_category', { title: 'password category page' });
});

router.get('/add-new-category', function(req, res, next) {
  res.render('add_new_category', { title: 'Add Category' });
});

router.get('/add-new-password', function(req, res, next) {
  res.render('add_new_password', { title: 'Add password' });
});
router.get('/view-all-passwords', function(req, res, next) {
  res.render('view_all_passwords', { title: 'passwords' });
});
router.get('/dashboard', function(req, res, next) {
  

  res.render('dashboard', { title: 'DASHBOARD' });
});
router.get('/logout', function(req, res, next) {
  

  res.redirect('/');
});
module.exports = router;
