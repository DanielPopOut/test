module.exports = function (app,bcrypt,dateFormat,ObjectId,db) {
	//ici on a juste un id, mail et mdp
	var collectionName = 'credential';
	var callAdress = '/credential';
	var credentialdb = db.collection(collectionName);
	var userdb = db.collection('user');

	//Récupérer un utilisateur en entrant son id dans la requete
	app.get('/credential',function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.identifiant;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		credentialdb.findOne(
		   	{_id: ObjectId(identifiant)},function(err, user) {
		   		console.log(user);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting' + collectionName + ' for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			res.json({statut:1,data:user});
		   		}
		   	}
		);
	});


	app.put(callAdress,function(req,res){
		var valueToInsert = req.body;
		valueToInsert.created = new Date();
		valueToInsert.modified = new Date();
		var identifiant = req.query.identifiant;

		credentialdb.update({_id: ObjectId(identifiant)},
			valueToInsert,
			{ upsert: false }
			,function(err, result) {
				if(err) {
					console.log('********************************');
					console.log('Error while inserting ' + collectionName);
					console.log(err);
					console.log('********************************');
					res.send(err);
				}else{
					res.json({statut:1,data:valueToInsert});
				}	
		})
		});

		//enregistrer un utilisateur
	app.post('/credential/new_user',function(req,res){
		var valueToInsert = req.body;
		var credential = valueToInsert.credential;
		var user = valueToInsert.user;

		credential.created = new Date();
		user.created = new Date();


// test si le pseudo est déjà utilisé
		userdb.findOne({pseudo : user.pseudo},function(err, result) {
		   		console.log(result);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting user for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			if (result!=null){
			   			res.json({statut:10,result: "pseudo already taken"});
		   			}else{
		   				//test si le mail est déjà utilisé
		   				credentialdb.findOne({mail : credential.mail},function(err, result) {
					   		console.log(result);
					   		if(err){
					   			console.log('****************************');
					   			console.log('Error while getting user for login');
					   			console.log('****************************');
					   			res.json({statut:-1});
					   		}else{
					   			if (result!=null){
						   			res.json({statut:10,result: "mail already taken"});
					   			}else{
					   				//écrit les données dans la base de données
					   				credentialdb.insert(credential,function(err, result) {
										if(err) {
											console.log('********************************');
											console.log('Error while post' + collectionName);
											console.log(err);
											console.log('********************************');
											res.send(err);
										}else{
											credential.id=result._id;
											user.id= result._id;
											
											if(result._id!=null){
												//écrit les données utilisatuer dans la base de donnée
												userdb.insert(user,function(err, result) {
													if(err) {
														console.log('********************************');
														console.log('Error while post' + collectionName);
														console.log(err);
														console.log('********************************');
														res.send(err);
													}else{
														res.json({statut:1,data:result});
													}	
												});
											}
										}	
									});

									
					   			}
					   		}
					   	});
		   			}
		   		}
		   	});
		});

		

		



		//enregistrer un utilisateur
	app.post(callAdress,function(req,res){
		var valueToInsert = req.body;
		valueToInsert.created = new Date();


		credentialdb.insert(valueToInsert,function(err, result) {
			if(err) {
				console.log('********************************');
				console.log('Error while post' + collectionName);
				console.log(err);
				console.log('********************************');
				res.send(err);
			}else{
				res.json({statut:1,data:valueToInsert});
			}	
		})
		});


	app.delete(callAdress,function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.identifiant;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		credentialdb.deleteOne(
		   	{_id: ObjectId(identifiant)},function(err, user) {
		   		console.log(user);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while deleting' + collectionName);
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			res.json({statut:1,data:user});
		   		}
		   	}
		);
	});

}