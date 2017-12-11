var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

app.set('views', __dirname + '/views'); // app.set(name, value)
app.engine('html', require('ejs').renderFile);

app.use(session({secret: 'SimpleSecretKey'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sess;



/*/login now saves their data on the cookie using the “Set-Cookie” header.
*/

app.post('/login', function(req, res) {
	  User.findOne({ email: req.body.email }, function(err, user) {
	    if (!user) {
	      res.render('login.jade', { error: 'Invalid email or password.' });
	    } else {
	      if (req.body.password === user.password) {
	        // sets a cookie with the user's info
	        req.session.user = user;
	        res.redirect('/dashboard');
	      } else {
	        res.render('login.jade', { error: 'Invalid email or password.' });
	      }
	    }
	  });
	});

app.post('/login',function(req,res){
	  sess = req.session;
	//In this we are assigning email to sess.email variable.
	//email comes from HTML page.
	  sess.email=req.body.email;
	  res.end('done');
	});





app.get('/',function(req,res){
sess = req.session;
//Session set when user Request our app via URL
if(sess.email) {
	
    res.redirect('/admin');
}
else {
    res.render('index.html');
}
});


app.get('/admin',function(req,res){
  sess = req.session;
if(sess.email) {
res.write('
<h1>Hello '+sess.email+'</h1>
');
res.end('<a href="+">Logout</a>');
} else {
    res.write('
     <h1>Please login first.</h1>
    ');
    res.end('<a href="+">Login</a>');
}
});

app.get('/logout',function(req,res){
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});

});
app.listen(3000,function(){
console.log("App Started on PORT 3000");
});