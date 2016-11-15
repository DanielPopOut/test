module.exports = function (app,bcrypt,dateFormat,ObjectId,db,users) {
	
	//RAPPEL : Si mon url est : http://www.daniel.com?token=12312123 (GET)
	//Pour accéder à token, c'est req.query.token

	//RAPPEL : Si on est en post, put ou delete, les données sont accessibles via req.body
	//Par exemple pour accéder à token ce sera req.body.token
	//req.body est de la forme {token:12121212,id:123123213}

	//POUR RENVOYER DES DONNEES C'EST res.json()

	//PREMIER ENDPOINT
	app.get('/home',function(req,res){
		res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = "";
		//NE PAS OUBLIER ObjectId() devant l'identifiant

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		users.findOne(
		   	{_id: ObjectId(identifiant)},function(err, user) {
		   		console.log(user);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting user for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			res.json({statut:1,data:user});
		   		}
		   	}
		);

		//POUR RECUPERER PLUSIEURS UTILISATEURS
		users.find(
			{user_id:ObjectId(identifiant)}).toArray(function(err, docs) {
				if(err){
					console.log('****************************');
		   			console.log('Error while getting user for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
				}else{
					if(docs.length>0){
						//SI ON A UN RESULTAT
						res.json({statut:1});
					}else{
						//SI ON N'A PAS DE RESULTATS
						res.json({statut:0});
					}
				}
		});

	});

	//DEUXIEME ENDPOINT
	app.put('/home',function(req,res){
		res.json({statut:1});
	});

	app.post('/home',function(req,res){
		//AJOUT D'UN ELEMENT EN POST
		var obj = {name:"toto",created:new Date()};
		//INSERTION D'UN UTILISATEUR
		users.insert(obj, function(err, result) {
			if(err) {
				console.log('********************************');
				console.log('Error while inserting folders');
				console.log(err);
				console.log('********************************');
				res.send(err);
			}else{
				res.json({statut:1,users:obj,result:result});
			}	
		});
		//UPSERT, SI LE CRITERE DE MODIF N'EXISTE PAS, ON CREE UN NOUVEL ENREGISTREMENT
		users.update(
			{ name: "Andy" },
		   	{
		      	name: "Andy",
		      	rating: 1,
		      	score: 1
		   },
		   { upsert: true },
		   function(err,result){
		 		if(err){

		 		}else{

		 		}
		   }
		);
	});

	app.delete('/home',function(req,res){
		users.deleteOne( { "_id" : ObjectId("563237a41a4d68582c2509da") },function(err,result){
			if(err){
				console.log('********************************');
				console.log('Error while inserting folders');
				console.log(err);
				console.log('********************************');
				res.send(err);
			}else{

			}
		});

	});
}
