/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Slydrz' });
};

// Get log in page same as app.get /login only as a module in routes
exports.login = function(req, res){
  res.render('login');
};

// Get worker page
exports.slydr = function(req, res){
  if(req.session.passport.user=== undefined){
    res.redirect('/login');
  } else
  { res.render('slydr', { title:"please try again"})}
};

//To DO Send the editor info to be rendered


exports.editorlogin = function(req, res){
  if(req.session.passport.user=== undefined){
    res.redirect('/editorlogin');
  } else
  { res.render('editordashboard', { user:  req.user  })}
};


exports.logout = function(req, res){
    res.redirect('/');
};
