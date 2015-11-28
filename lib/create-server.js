// var ejs               = require('ejs'),
var bodyParser        = require('body-parser'),
    methodOverride    = require('method-override'),
    session           = require('express-session'),
    express           = require('express');
    // expressEjsLayouts = require('express-ejs-layouts');

module.exports = function () {
  var server = express();

  // server.set('views', './partials');
  // server.set('view engine', 'ejs');

server.use(session({
  secret: "DontLookAtMySecrets",
  resave: false,
  saveUninitialized: true
}));

server.use(function (req, res, next) {
  res.locals.flash  = req.session.flash || {};
  req.session.flash = {};
  next();
});

server.use(function (req, res, next) {
 res.locals.currentUser = req.session.currentUser;
 next();
});

  server.use(express.static('./public'));
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(methodOverride('_method'));
  // server.use(expressEjsLayouts);

  return server;
};
