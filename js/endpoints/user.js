module.exports = function (app,bcrypt,dateFormat,ObjectId,db) {
	var collectionName = 'user';
	var callAdress = "/user";
	var userdb = db.collection(collectionName);
	var frienddb = db.collection('friend');

	//Récupérer un utilisateur en entrant son id dans la requete
	app.get('/user',function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var pseudoRecu = req.query.pseudo;
		var askingId = req.query.id1;

		//NE PAS OUBLIER ObjectId() devant l'identifiant
		//que se passe-t-il ?

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		userdb.findOne({pseudo: pseudoRecu},function(err, user) {
		   		console.log(user);
		   		console.log(askingId);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting user for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			if(user!=null){
		   				frienddb.findOne({$or: [ 
							{ user1Id: askingId, user2Id: user._id.toString() }, 
							{ user1Id: user._id.toString(), user2Id: askingId }
							]},
							function(err, friend) {
						   		console.log(friend);
						   		console.log(askingId);
						   		console.log(user._id);
						   		if(err){
						   			console.log('****************************');
						   			console.log('Error while getting user for login');
						   			console.log('****************************');
						   			res.json({statut:-1});
						   		}else{
						   			if (friend == null){
						   				res.json({statut:1,data:user});
						   			}else{
						   				res.json({statut:1,data:user, friend:friend});
						   			}
						   		}
					   	})
		   			}else{
		   				res.json({statut:0});
		   			}
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
