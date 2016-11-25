module.exports = function (app,bcrypt,dateFormat,ObjectId,db) {
	var collectionName = 'user';
	var callAdress = "/user";
	var userdb = db.collection(collectionName);

	//Récupérer un utilisateur en entrant son id dans la requete
	app.get('/user',function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.identifiant;
		//NE PAS OUBLIER ObjectId() devant l'identifiant
		//que se passe-t-il ?

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		userdb.findOne(
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
	});




		//POST
	app.post(callAdress,function(req,res){
		var userToInsert = req.body;
		userToInsert.created = new Date();

		userdb.insert(userToInsert,function(err, result) {
			if(err) {
				console.log('********************************');
				console.log('Error while inserting user');
				console.log(err);
				console.log('********************************');
				res.send(err);
			}else{
				res.json({statut:1,data:userToInsert});
			}	
		})
		});

			//PUT // Remplacer User datas
	app.put(callAdress,function(req,res){
		var userToInsert = req.body;
		userToInsert.created = new Date();
		userToInsert.modified = new Date();
		var identifiant = req.query.identifiant;

		userdb.update({_id: ObjectId(identifiant)},
			userToInsert,
			{ upsert: false }
			,function(err, result) {
				if(err) {
					console.log('********************************');
					console.log('Error while inserting user');
					console.log(err);
					console.log('********************************');
					res.send(err);
				}else{
					res.json({statut:1,data:userToInsert});
				}	
		})
		});

	app.delete(callAdress,function(req,res){
		var identifiant = req.query.identifiant;

		userdb.deleteOne(
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
	});

}
<<<<<<< HEAD


=======
>>>>>>> origin/master
