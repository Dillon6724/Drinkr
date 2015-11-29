var mongoose = require('mongoose'),
    server   = require('./lib/create-server')(),
    bcrypt   = require('bcrypt'),
    PORT     = process.env.PORT || 3000,
    dbname   = 'drinkr'
    MONGOURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017',
    Schema   = mongoose.Schema,
    User     = require('./models/user.js');

///////////////////////////////////////////////////////////
/////////////           ROUTES             ////////////////
///////////////////////////////////////////////////////////

// when a user logs in
server.post('/session', function (req, res) {
  req.body.user.email = req.body.user.email.toLowerCase();
  User.findOne({email: req.body.user.email}, function (err, currentUser) {
    if (err) {
        console.log(err);
    } else {
        if (currentUser === null) {
          req.session.flash.userDoesntExist = "Incorrect Email/Password combo";
          res.redirect(302, '/login')
        } else {
          bcrypt.compare(req.body.user.password, currentUser.password, function (err, match) {
            if (err) {
              console.log(err);
            } else if (!match) {
              req.session.flash.incorrectPassword = "Incorrect Email/Password combo";
              res.redirect(302, '/login')
            } else {
              req.session.currentUser = req.body.user.email;
            }  res.redirect(302, '/')
          })
        }
    };
  });
});

// when a new user is created
server.post('/user/new', function (req, res) {
  if (!req.body.user.password) {
    req.session.flash.needPassword = "Please enter an password";
    res.redirect(302, '/login');
  } else if (!req.body.user.email) {
    req.session.flash.needUser = "Please enter a valid email";
    res.redirect(302, '/login');
  } else{
    var userInfo = req.body.user
  	req.session.currentUser = userInfo.email;
  	var newUser = new User(userInfo)

    //save the user iusing infor from the params
    newUser.save(function (err, createdUser) {
      if (err) {
        if (err.code === 11000) {
          req.session.flash.duplicateName = "Email is taken";
          res.redirect(302, '/login');
        } else {
          console.log(err);
        }
      } else {
        req.session.currentUser = req.body.user.email
        res.redirect(302, '/')
      }
    });
  }
});


server.get("/login", function(req, res) {
  res.sendFile("login.html", {
    root:"public"
  })
})

server.get("/",  function (req, res) {
  res.sendFile("index.html", {
    root: __dirname + "/public/"
  })
})

server.get("/clubs", function (req, res) {
  res.sendFile("index.html", {
    root: __dirname + "/public/"
  })
})

server.get("/sports", function (req, res) {
  res.sendFile("index.html", {
    root: __dirname + "/public/"
  })
})

server.get("/gay", function (req, res) {
  res.sendFile("index.html", {
    root: __dirname + "/public/"
  })
})

server.get("/dive", function (req, res) {
  res.sendFile("index.html", {
    root: __dirname + "/public/"
  })
})


server.get("/karaoke", function (req, res) {
  res.sendFile("index.html", {
    root: __dirname + "/public/"
  })
})


mongoose.connect(MONGOURI + "/" + dbname);
  server.listen(PORT, function () {
    console.log("\n Hello, it's me on ", PORT);
});
