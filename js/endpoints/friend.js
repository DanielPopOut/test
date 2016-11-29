module.exports = function (app,bcrypt,dateFormat,ObjectId,db) {
	//ici on a juste un id, mail et mdp
	var collectionName = 'friend';
	var callAdress = '/friend';
	var frienddb = db.collection(collectionName);

	//Récupérer un utilisateur en entrant son id dans la requete
	app.get(callAdress,function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.id;
		var results1;
		var results2;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		frienddb.find(
		   	{ user1Id: identifiant } ).toArray(function(err, docs) {
		   		console.log(docs);
		   		if(err){
					console.log('****************************');
		   			console.log('Error while getting user for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
				}else{
						results1 = docs;
				}
		   	});

	   	frienddb.find(
	   	{  user2Id: identifiant } ).toArray(function(err, docs2) {
	   		console.log(docs2);
	   		if(err){
				console.log('****************************');
	   			console.log('Error while getting user for login');
	   			console.log('****************************');
	   			res.json({statut:-1});
			}else{
				
					results2 = docs2;
			}
	   	});

	   	var results = results1.concat(results2);
	   	if(results.length>0){
	   		res.json({statut:1,data:results});
	   	}else{
	   		res.json({statut:0});
	   	}
					//SI ON A UN RESULTAT
	});


	app.put(callAdress,function(req,res){
		var valueToInsert = req.body;
		valueToInsert.created = new Date();
		valueToInsert.modified = new Date();
		var identifiant = req.query.identifiant;

		userdb.update({_id: ObjectId(identifiant)},
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
	app.post(callAdress,function(req,res){
		var valueToInsert = req.body;
		valueToInsert.created = new Date();


		frienddb.insert(valueToInsert,function(err, result) {
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
		frienddb.deleteOne(
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