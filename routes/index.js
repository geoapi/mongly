/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Slydrz' });
};

// Get log in page
exports.login = function(req, res){
  res.render('login', { title: 'Log in to Slydrz' });
};

// Get worker page
exports.slydr = function(req, res){
  if(req.session.passport.user=== undefined){
    res.redirect('/login');
  } else
  { res.render('slydr', { title: 'Hello to Slydrz!' })}
};