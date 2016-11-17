var express = require('express');
const https = require('https');
var fs = require("fs");
// var privateKey  = fs.readFileSync('server.key', 'utf8');
// var certificate = fs.readFileSync('server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

var app = express();//creation du serveur
app.set('port', (process.env.PORT || 5000));

var http = require('http');
var server = http.createServer(app);

var morgan = require('morgan');
var dateFormat = require('dateformat');
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_live_ws0qyQJVyJo6W5FAwUf0nael');
var multiparty = require('connect-multiparty');
var session = require('express-session');

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var request = require('request');
var requestIp = require('request-ip');
// var less = require('less');

app.use(bodyParser.json({limit: '15mb'}));
app.use(bodyParser.urlencoded({ extended: true }));



var multipartyMiddleware = multiparty();

var bcrypt = require('bcrypt-nodejs');

app.use(express.static(__dirname+'/public'));

app.use('/js',express.static(__dirname+'/js/'));

app.use('/lib', express.static(__dirname + '/node_modules/'));


app.use(morgan('dev')); //log every request
app.use(bodyParser.urlencoded({'extended':'true'}));//parse application/x-www-form
app.use(bodyParser.json()); //parse application/json
app.use(bodyParser.json({type:'application/vnd.api+json'}));//parse application/vnd.api-json

app.use(cookieParser('Z1758V66NFJ5N67IORMJ5HJFN45GC4GJZ4'));
app.use(cookieSession({
	key:    'uptime',
	secret: 'azesdfhj6732hdjsjhJ124532sqdhjqs',
 	proxy:  true,
 	cookie: { maxAge: 60 * 60 * 1000 }
 }));

var flash = require('connect-flash');

/******************************************************************
				CONFIGURATION DE LA BASE DE DONNÉES
******************************************************************/
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
//URL DE CONNEXION A LA BASE DE DONNÉES
var MONGODB_URI = 'mongodb://heroku_5zhctz3n:tmm17magpnlkp8p1tmpeod8b68@ds029585.mlab.com:29585/heroku_5zhctz3n';

//CREATION D'UN POINTEUR VERS LA BASE DE DONNÉES
var db;
//CREATION D'UN POINTEUR VERS UN DOCUMENT
var users;

//CONNEXION A LA BASE DE DONNEE MONGODB VIA URL
mongodb.MongoClient.connect(MONGODB_URI, function(err, database) {
  	if(err){
  		throw err;
  		console.log('ERROR');
  		console.log(err);
  	} 
 	//DB C'EST MA BASE DE DONNÉES
	db = database;
	//USERS C'EST MON DOCUMENT
	users = db.collection('users');

	//ON INCLU UN SCRIPT QUI VA CONTENIR NOS ENDPOINT
	require('./js/demo/demo.js')(app,bcrypt,dateFormat,ObjectId,db,users);
	require('./js/endpoints/user.js')(app,bcrypt,dateFormat,ObjectId,db);

	//DEMARRE LE SERVEUR
	server.listen(app.get('port'));

});




/************************************************************/
//			NE PAS TOUCHER LA SUITE DU CODE EN DESSOUS
/************************************************************/
// var io = require('socket.io')(server);
// var socketlist = [];

// io.on('connection', function(client){
// 	console.log('a user connected');
// 	console.log('*******************');
// 	console.log(client.conn.id);
// 	console.log('*******************');
// 	// io.to(client.conn.id).emit('message', 'who are you');
// 	io.emit('message','an event sent to all connected clients');
// 	// io.emit('message', 'who are you');
// 	// console.log(io.sockets.connected);
// 	client.on('inscription', function(from,data){
//   		console.log('a new inscription');
//   		console.log(data);
//   	});

//   	client.on('event', function(from,data){
//   		console.log('a new event occured');
//   	});

//   	client.on('message', function(from,data){
//   		console.log('a new event occured');
//   	});

//   	client.on('disconnect', function(){
//   		console.log('a user disconnected');
//   	});
// });

// var requestIp = require('request-ip');

// var MobileDetect = require('mobile-detect');

// var sendgrid = require("sendgrid")("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");
// //INITIALISATION DU MODULE PASSPORT
// var passport = require('passport')
//  , LocalStrategy = require('passport-local').Strategy;

// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());

// var auth = function(req,res,next){
// 	// res.send(401);
// 	if(!req.isAuthenticated()){
// 		res.setHeader('Content-Type', 'text/html');
//     	res.status(401);
//     	res.redirect('/login');
// 	}
// 	else{
// 		next();
// 	}
// }

/**************************************************************/
//						GET USER DATA
/**************************************************************/
// app.get('/api/users',function(req,res){
// 	users.findOne({_id : req.query._id}).toArray(function (err, docs) {
// 		console.log(docs);
// 		res.json({statut:1,data:docs});
// 	});
// });
/**************************************************************/
//						ADD NEW USER
/**************************************************************/
// app.post('/api/users',function(req,res){
// 	users.insert(req.body, function(err, result) {
// 		if(err) {
// 			console.log(err);
// 			throw err;
// 		}
// 		res.json({statut:1});	
// 	});
// });

/**************************************************************/
//						EDIT NEW USER
/**************************************************************/
// app.put('/api/users',function(req,res){

// });

/**************************************************************/
//						DELETE NEW USER
/**************************************************************/
// app.delete('/api/users',function(req,res){
// 	users.deleteOne( { "_id" : req.body.id}, function(err,result){
// 		if(err) {
// 			throw err;
// 		}
// 		//DELETE COMMENT

// 		//DELETE LINK

// 		//DELETE FOLDER
// 		res.json({statut:1});	
// 	});
// });

// app.get('/', function(req, res) { 
// 	console.log('here');
// 	var seedData = [
// 	  {
// 	    decade: '1970s',
// 	    artist: 'Debby Boone',
// 	    song: 'You Light Up My Life',
// 	    weeksAtOne: 10
// 	  },
// 	  {
// 	    decade: '1980s',
// 	    artist: 'Olivia Newton-John',
// 	    song: 'Physical',
// 	    weeksAtOne: 10
// 	  },
// 	  {
// 	    decade: '1990s',
// 	    artist: 'Mariah Carey',
// 	    song: 'One Sweet Day',
// 	    weeksAtOne: 16
// 	  }
// 	];
// 	console.log('here');
// });

// //PAGE 404
// app.use(function(req, res, next){
//     res.render('404.ejs');
// });


/*************************************************************/
// 						FOLDERS FUNCTION
/*************************************************************/


// mongodb.MongoClient.connect(MONGODB_URI, function(err, database) {
//   	if(err){
//   		throw err;
//   		console.log('ERROR');
//   		console.log(err);
//   	} 
 
// 	db = database;
// 	users = db.collection('users');
// 	folders = db.collection('folders');
// 	links = db.collection('links');
// 	comments = db.collection('comments');
// 	logs = db.collection('logs');
// 	participants = db.collection('participants');
// 	//users.createIndex( { "email": 1 }, { unique: true } );

// 	// console.log(users);
// 	// console.log(folders);
// 	// console.log(app.get('port'));
//   	server.listen(app.get('port'));

//   	// //ON SERIALISE L'ID DE L'UTILISATEUR CONNECTÉ
// 	passport.serializeUser(function(user, done) {
// 		console.log('here serialize');
// 		console.log('User is ');
// 		console.log(user._id);
// 		done(null, user._id);
// 	});

// 	//ON DESERIALIZE L'ID DE L'UTILISATEUR CONNECTÉ
// 	passport.deserializeUser(function(id, done) {
// 		console.log('deserialize');
// 		console.log('Id is '+id);
// 		console.log('Done '+done);
// 		users.findOne(
// 		   { _id: ObjectId(id) },function(err, user) {
// 		   		console.log(user);
// 		   		if(err){
// 		   			console.log('****************************');
// 		   			console.log('Error while getting user for login');
// 		   			console.log('****************************');
// 		   			res.send(err);
// 		   		}else{
// 		   			console.log(user);
// 					done(null,user); 	
// 		   		}
// 		   	}
// 		);
// 	});

// 	//STRATEGIE DE CONNEXION A LA BASE DE DONNEE
// 	passport.use(new LocalStrategy({ passReqToCallback : true},
// 	  	function(req,username, password, done) {
// 	  		// console.log(username);
// 	  		// console.log(password);
// 	  		if(username.trim() && password.trim()){
// 				users.findOne(
// 				   { email: username.trim() },function(err, user) {
// 				   		console.log(user);
// 				   		if(err){
// 				   			console.log('****************************');
// 				   			console.log('Error while getting user for login');
// 				   			console.log('****************************');
// 				   			res.send(err);
// 				   		}else{
// 				   			console.log('****************************');
// 				   			bcrypt.compare(password.trim(), user.password, function(err, res) {
// 								if(err){
// 									console.log('probleme mot de passe');
// 									return done(err);
// 								}
// 								if(res==true){//SI LES MOTS DE PASSES CORRESPONDENT, 
// 									//ON PEUT HASHER NOTRE MOT DE PASSE VERS LA BASE DE DONNEE
// 									console.log('Les mots de passe correspondent');	
// 									//ICI ON VA ENREGISTRER LA NOUVELLE CONNEXION
// 									var date_lastlogin = new Date();
// 									users.update({_id:ObjectId(user._id)}, {$set:{last_login:date_lastlogin}}, function(err, result){
// 										if(err){
// 											console.log(err);
// 											return done(err);
// 										}else{
// 											var lastlogin = {user_id:user._id,date:date_lastlogin};
// 											logs.insert(lastlogin, function(err, resultbis) {
// 												if(err) {
// 													console.log('********************************');
// 													console.log('Error while inserting user');
// 													console.log(err);
// 													console.log('********************************');
// 													res.send(err);
// 												}else{
// 													return done(null,user,req.flash('message','Le mot de passe est correct'));
// 												}	
// 											});
// 										}
// 									});
// 								}else{
// 									console.log('Les mots de passe ne correspondent pas');
// 									connection.release();
// 									return done(null,false,req.flash('message','Le mot de passe est incorrect'));
// 								}
// 							});
// 				   		}
// 				   }
// 				);
// 			} 
// 		}
// 	));
	
// 	app.post('/login',
// 	  	passport.authenticate('local', {	
// 	  		successRedirect: '/home',
// 			failureRedirect: '/login',
// 			failureFlash: true})
// 	);


// 	app.get('/test',function(req,res){
		
// 		var helper = require('sendgrid').mail;
// 		var from_email = new helper.Email('boris@azamink.com',"Boris from Azamink");
// 		var to_email = new helper.Email('tchangang.boris@gmail.com');
// 		var subject = 'Hello World from the SendGrid Node.js Library!';
// 		var content = new helper.Content('text/plain', 'Hello, Email!');
// 		var mail = new helper.Mail(from_email, subject, to_email, content);

// 		var request = sendgrid.emptyRequest({
// 		  method: 'POST',
// 		  path: '/v3/mail/send',
// 		  body: mail.toJSON(),
// 		});

// 		sendgrid.API(request, function(error, response) {
// 		  console.log(response.statusCode);
// 		  console.log(response.body);
// 		  console.log(response.headers);
// 		  res.json({statut:1});
// 		});
// 	});
// 	/*************************************************************/
// 	// 				APPLICATION AND PAGES FUNCTION
// 	/*************************************************************/
// 	require('./js/server/app/home.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/app/login.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
//   	require('./js/server/app/signup.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
  	
//   	/*************************************************************/
// 	// 						USERS FUNCTION
// 	/*************************************************************/
// 	require('./js/server/users/add.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/users/login.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/users/logout.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/users/get.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/users/getlist.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/users/edit.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/users/delete.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);

// 	/*************************************************************/
// 	// 						FOLDERS FUNCTION
// 	/*************************************************************/
// 	require('./js/server/folders/add.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/folders/edit.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	/*************************************************************/
// 	// 						LINKS FUNCTION
// 	/*************************************************************/
// 	require('./js/server/links/add.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/links/linksfromfolder.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/app/mink.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	/*************************************************************/
// 	// 						COMMENTS FUNCTION
// 	/*************************************************************/
// 	require('./js/server/comments/add.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);
// 	require('./js/server/comments/commentsfromlink.js')(app,bcrypt,dateFormat,sendgrid,stripe,db,users,folders,links,comments,participants,request,requestIp,ObjectId,auth);

//   	console.log('App listening here');
// });