module.exports = function (app,bcrypt,dateFormat,ObjectId,db) {
	//ici on a juste un id, mail et mdp
	var collectionName = 'participant';
	var callAdress = '/participant';
	var participantdb = db.collection(collectionName);

	participantdb.createIndex( { eventId: 1, guestId: 1}, { unique: true } );


	//Récupérer un utilisateur en entrant son id dans la requete
	app.get(callAdress,function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.identifiant;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		participantdb.findOne(
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

		userdb.update({_id: ObjectId(identifiant)},
			valueToInsert,
			{ upsert: false }
			,function(err, result) {
				if(err) {
					console.log('********************************');
					console.log('Error while inserting ' + collectionName);
					console.log(err);
					console.log('********************************');
		   			res.json({statut:-1});
				}else{
					res.json({statut:1,data:valueToInsert});
				}	
		})
		});

		//enregistrer un utilisateur
	app.post(callAdress,function(req,res){
		var participantList = req.body;
		var participantToAdd;
		for (var i = 0; i < participantList; i++) {
			console.log(participantList[i]);
			participantToAdd = participantList[i];
			participantToAdd.created = new Date();
			userdb.update({eventId: participantToAdd.eventId, guestId: participantToAdd.guestId},
			participantToAdd,
			{ upsert: true }
			,function(err, result) {
				if(err) {
					console.log('********************************');
					console.log('Error while inserting ' + collectionName);
					console.log(err);
					console.log('********************************');
		   			res.json({statut:-1});
				}	
		})
		};
		res.json({statut:1});
		});

			//enregistrer un utilisateur
	app.post(callAdress+'/join',function(req,res){
		var joinParticipant = req.body;
		var participantToAdd;
		
		userdb.update({eventId: joinParticipant.eventId, guestId: joinParticipant.guestId},
			joinParticipant,
			{ upsert: true }
			,function(err, result) {
				if(err) {
					console.log('********************************');
					console.log('Error while inserting ' + collectionName);
					console.log(err);
					console.log('********************************');
		   			res.json({statut:-1});
				}else{
					res.json({statut:1});
				}
		});
		});


	app.delete(callAdress,function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.identifiant;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		participantdb.deleteOne(
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