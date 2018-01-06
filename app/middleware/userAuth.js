module.exports.userAuth = function(req, res, next){
  console.log('calle');
  if(!req.session.user){
    res.redirect('/login');
  }else{
    return next();
  }
};
