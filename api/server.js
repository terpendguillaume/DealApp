// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var sqlite3     = require('sqlite3');
var db = new sqlite3.Database('database.db');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
// var User   = require('./models/user'); // get our mongoose

//ALLOW CROSS DOMAIN
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
// mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
// we'll get to these in a second
var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth! Oh yeah !' });
});

apiRoutes.post('/login', function(req, res) {
    var username = req.query.username;
    var password = req.query.password;

  // find the user from email or username

  var queryParams = [username];
  var query = "SELECT * FROM Users WHERE username = ?";

  db.get(query, queryParams, function(err, data){
      if(err){
          res.status(500).json(err);
      }
      else{
          console.log(data);
          if(data == null){
              // if user is not found
              res.json({ success: false, message: 'Authentication failed. User not found.' });
          }
          else{
              if(password != data.password){
                  // if user is found and password is wrong
                  res.json({ success: false, message: 'Authentication failed. Wrong password.' });
              }
              else{
                  // if user is found and password is right
                  // create a token
                  var payload = {"username":data.username,"seller":data.seller};
                  var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: "2 days" // expires in 24 hours
                  });
                  // return the information including token as JSON
                  res.json({
                    success: true,
                    message: 'Authentication succeeded!',
                    token: token
                  });
              }
          }
      }
  })
});

apiRoutes.post('/signup', function(req, res){
    var username = req.query.username;
    var password = req.query.password;
    var seller = req.query.seller;

    var queryParams = [username, password, seller];

    var query = "INSERT INTO Users (username, password, seller) VALUES (?, ?, ?)";
    db.run(query, queryParams, function(err){
        if(err){
             res.json({ success: false, message: 'Failed to create a new account.' });
        }
        else{
            // if user is successfully created
            // create a token
            var payload = {"username":username,"seller":seller};
            var token = jwt.sign(payload, app.get('superSecret'), {
              expiresIn: "2 days" // expires in 48 hours
            });
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'New account created. Authentication succeeded!',
              token: token
            });
        }
    })
});

apiRoutes.get('/vouchers', function(req, res) {
    var top = req.query.top;

    if(top){
        var query = "SELECT id, owner, title, shop, expiration, value, description, COUNT(Vouchers.id) as buyers FROM Vouchers INNER JOIN Associations ON Vouchers.id = Associations.voucher GROUP BY id ORDER BY buyers DESC LIMIT ?";
    }
    else{
        var query = "SELECT id, owner, title, shop, expiration, value, description FROM Vouchers";

    }

    db.all(query, top, function(err, data){
        if(err){
             res.json({ success: false, message: 'Failed to retrieve vouchers\' list.' });
        }
        else{
            res.json({ success: true, vouchers: data });
        }
    })
});

apiRoutes.get('/vouchers/:id', function(req, res) {
    var id = req.params.id;
    var queryParams = [id];

    var query = "SELECT id, owner, title, shop, expiration, value, description FROM Vouchers WHERE id = ?";
    db.get(query, queryParams, function(err, data){
        if(err){
             res.json({ success: false, message: 'This voucher doesn\'t exist.' });
        }
        else{
            res.json({ success: true, voucher: data });
        }
    })
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
  });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

apiRoutes.get('/users', function(req, res) {
    var query = "SELECT username, seller FROM Users";
    db.all(query, function(err, data){
        if(err){
            res.json({ success: false, message: 'Failed to retrieve users\' list.' });
        }
        else{
            res.json({ success: true, users: data });
        }
    })
});

apiRoutes.get('/users/:username', function(req, res) {
    var username = req.params.username;
    var queryParams = username

    var query = "SELECT username, seller FROM Users WHERE username = ?";
    db.get(query, queryParams, function(err, data){
        if(err){
            res.json({ success: false, message: 'This user doesn\'t exist.' });
        }
        else{
            res.json({ success: true, user: data });
        }
    })
});

apiRoutes.post('/users/:username/vouchers', function(req, res) {
    var username = req.params.username;
    var id = req.query.id;

    var queryParams = [username, id];
    var query = "INSERT INTO Associations (user, voucher) VALUES (?, ?)";
    db.run(query, queryParams, function(err, data){
        if(err){
            res.json({ success: false, message: 'Vous possédez déjà ce coupon de réduction.', error: err });
        }
        else{
            res.json({ success: true, vouchers: data });
        }
    })
});

apiRoutes.get('/users/:username/vouchers', function(req, res) {
    var username = req.params.username;
    var seller = req.decoded.seller;
    var blackmarket = req.query.blackmarket;

    if(seller == "true"){
        var queryParams = username;
        var query = "SELECT id, owner, title, shop, expiration, value, description FROM Vouchers WHERE owner = ?";
    }
    else{
      if(blackmarket == "false"){
        var queryParams = username;
        var query = "SELECT id, owner, title, shop, expiration, value, description, user FROM Associations LEFT JOIN Users ON username = user LEFT JOIN Vouchers ON voucher = id WHERE user = ? AND id IS NOT NULL AND blackmarket = \'false\'";
      }
      else{
        var queryParams = username;
        var query = "SELECT id, owner, title, shop, expiration, value, description, user FROM Associations LEFT JOIN Users ON username = user LEFT JOIN Vouchers ON voucher = id WHERE user = ? AND id IS NOT NULL";
      }
            }
        db.all(query, queryParams, function(err, data){
        if(err){
            res.json({ success: false, message: 'This user doesn\'t exist.' });
        }
        else{
            res.json({ success: true, vouchers: data });
        }
    })
});

apiRoutes.delete('/users/:username/vouchers/:id', function(req, res) {
    var username = req.params.username;
    var id = req.params.id;
    var queryParams = [username, id];

    var query = "DELETE FROM Associations WHERE user = ? AND voucher = ?";
    db.run(query, queryParams, function(err, data){
        if(err){
            res.json({ success: false, message: 'This voucher doesn\'t exist.' });
        }
        else{
            res.json({ success: true, vouchers: data });
        }
    })
});

apiRoutes.delete('/users/:username', function(req, res){
    var username = req.params.username;

    if(username != req.decoded.username){
        res.json({ success: false, message: 'You need to be logged on this account to delete it.' });
    }
    else{
        var queryParams = [req.decoded.username];
        var query = "DELETE FROM Users WHERE username = ?";
        db.run(query, queryParams, function(err){
            if(err){
                res.json({ success: false, message: 'Failed to delete your account. Error.' });
            }
            else{
                if(this.changes > 0){
                    res.json({ success: true, message: 'Account deleted.' });
                }
                else{
                    res.json({ success: false, message: 'Failed to delete your account. Wrong password or account no longer exists.' });
                }
            }
        })
    }
});

apiRoutes.post('/vouchers', function(req, res){
    if(req.decoded.seller == false){
        res.json({ success: false, message: 'You are not allowed to create a voucher.' });
    }
    else{

        var owner = req.decoded.username;
        var title = req.query.title;
        var shop = req.query.shop;
        var expiration = req.query.expiration;
        var value = req.query.value;
        var description = req.query.description;

        var queryParams = [owner, title, shop, expiration, value, description];
        console.log(queryParams);
        var query = "INSERT INTO Vouchers (owner, title, shop, expiration, value, description) VALUES (?, ?, ?, ?, ?, ?)";


        db.run(query, queryParams, function(err){
            if(err){
                 res.json({ success: false, message: 'Failed to create a new voucher.', error: err });
            }
            else{
                res.json({
                  success: true,
                  message: 'New voucher created.',
                  id: this.lastID
                });
            }
        })
    }
});

apiRoutes.delete('/vouchers/:id', function(req, res){
    var id = req.params.id;

    var queryParams = [id, req.decoded.username];
    var query = "DELETE FROM Vouchers WHERE id = ? AND owner = ?";
    db.run(query, queryParams, function(err){
        if(err){
            res.json({ success: false, message: 'Failed to delete your voucher. Error.' });
        }
        else{
            if(this.changes > 0){
                res.json({ success: true, message: 'Voucher deleted.' });
            }
            else{
                res.json({ success: false, message: 'Failed to delete this voucher. Either you are not the owner of this voucher or it has already been deleted.' });
            }
        }
    })
});

apiRoutes.get('/vouchers/:id', function(req, res) {
    var id = req.params.id;
    var queryParams = [id];

    var query = "SELECT id, owner, title, shop, expiration, value, description FROM Vouchers WHERE id = ?";
    db.get(query, queryParams, function(err, data){
        if(err){
             res.json({ success: false, message: 'This voucher doesn\'t exist.' });
        }
        else{
            res.json({ success: true, voucher: data });
        }
    })
});

apiRoutes.post('/blackmarket/', function(req, res) {
    var user = req.decoded.username;
    var voucher = req.query.voucher;
    var queryParams = [user, voucher];

    var query = "UPDATE Associations SET blackmarket = 'true' WHERE user = ? AND voucher = ?";
    db.run(query, queryParams, function(err, data){
        if(err){
             res.json({ success: false, message: 'This voucher doesn\'t exist.', error: err });
        }
        else{
            res.json({ success: true, message: 'Your voucher is now on the black market' });
        }
    })
});

apiRoutes.delete('/blackmarket/', function(req, res) {
    var user = req.decoded.username;
    var voucher = req.query.voucher;
    var queryParams = [user, voucher];

    var query = "UPDATE Associations SET blackmarket = 'false', buyer = null WHERE user = ? AND voucher = ?";
    db.run(query, queryParams, function(err, data){
        if(err){
             res.json({ success: false, message: 'This voucher doesn\'t exist.', error: err });
        }
        else{
            res.json({ success: true, message: 'Your voucher is longer on the black market' });
        }
    })
});

apiRoutes.get('/blackmarket/', function(req, res) {
    var user = req.decoded.username;
    var queryParams = [user];

    var query = "SELECT * FROM Associations LEFT JOIN Vouchers ON voucher = id WHERE user != ? AND blackmarket = \'true\'";
    db.all(query, queryParams, function(err, data){
        if(err){
             res.json({ success: false, message: 'The black market is unreachable.', error: err });
        }
        else{
            res.json({ success: true, vouchers: data });
        }
    })
});

apiRoutes.get('/blackmarket/:user', function(req, res) {
    var user = req.params.user;
    var queryParams = [user];

    var query = "SELECT * FROM Associations LEFT JOIN Vouchers ON voucher = id WHERE blackmarket = \'true\' AND user = ?";
    db.all(query, queryParams, function(err, data){
        if(err){
             res.json({ success: false, message: 'The black market is unreachable.', error: err });
        }
        else{
            res.json({ success: true, vouchers: data });
        }
    })
});

apiRoutes.put('/blackmarket/:user/:voucher/ask', function(req, res) {
    var buyer = req.decoded.username;
    var user = req.params.user;
    var voucher = req.params.voucher;
    var queryParams = [buyer, user, voucher];

    var query = "UPDATE Associations SET buyer = ? WHERE user = ? AND voucher = ?";
    db.run(query, queryParams, function(err, data){
        if(err){
             res.json({ success: false, message: 'This voucher doesn\'t exist.', error: err });
        }
        else{
            res.json({ success: true, message: 'The owner of this voucher needs to accept or to reject you demand.' });
        }
    })
});

// ?accept = false/true &buyer = client2
apiRoutes.put('/blackmarket/:user/:voucher/', function(req, res) {
    var user = req.params.user;
    var voucher = req.params.voucher;
    var accept = req.query.accept;
    var buyer = req.query.buyer;

    if(accept == "true"){
      var queryParams = [buyer, user, voucher];

      var query = "UPDATE Associations SET user = ?, buyer = null, blackmarket = \'false\' WHERE user = ? AND voucher = ?";
      db.run(query, queryParams, function(err, data){
          if(err){
               res.json({ success: false, message: 'This voucher doesn\'t exist.', error: err });
          }
          else{
              res.json({ success: true, message: 'Your voucher now belongs to ' + buyer });
          }
      })
    }
    else{
      var queryParams = [user, voucher];

      var query = "UPDATE Associations SET buyer = null WHERE user = ? AND voucher = ?";
      db.run(query, queryParams, function(err, data){
          if(err){
               res.json({ success: false, message: 'This voucher doesn\'t exist.', error: err });
          }
          else{
              res.json({ success: true, message: 'This offer has been rejected' });
          }
      })
    }
});


app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
