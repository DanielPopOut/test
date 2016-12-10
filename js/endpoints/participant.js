module.exports = function (app,bcrypt,dateFormat,ObjectId,db) {
	//ici on a juste un id, mail et mdp
	var collectionName = 'participant';
	var callAdress = '/participant';
	var participantdb = db.collection(collectionName);

	participantdb.createIndex( { eventId: 1, guestId: 1}, { unique: true } );


	//Récupérer la liste des participants en entrant l'id de l'évènement dans la requete
	app.get(callAdress,function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.id;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		participantdb.find(
		   	{eventId: identifiant}).toArray(function(err, participants) {
		   		console.log(participants);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting' + collectionName + ' for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			res.json({statut:1,data:participants});
		   		}
		   	}
		);
	});


	app.put(callAdress,function(req,res){
		var valueToInsert = req.body;
		valueToInsert.created = new Date();
		valueToInsert.modified = new Date();
		var identifiant = req.query.identifiant;

		participantdb.update({_id: ObjectId(identifiant)},
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

		//enregistrer une liste de participants 
		// !!!!!! ici si il y a une erreur, elle n'est pas retournée
	app.post(callAdress,function(req,res){
		var participantList = req.body.data;
		var participantToAdd;
		for (var j = 0; j < participantList.length; j++) {
				(function(i){
						console.log(participantList[i]);
						participantToAdd = participantList[i];
						participantToAdd.created = new Date();
						participantdb.insert(participantToAdd,function(err, result) {
								if(err) {
									console.log('********************************');
									console.log('Error while inserting ' + collectionName);
									console.log(err);
									console.log('********************************');
								}
						})
					
				})(j);
			};
			res.json({statut:1});
		});

			//enregistrer un utilisateur
	app.post(callAdress+'/join',function(req,res){
			var joinParticipant = req.body;

			participantdb.findAndModify({
				query: {eventId: joinParticipant.eventId, guestId: joinParticipant.guestId},
				update: {$set: {status:joinParticipant.status, modified: new Date()} },
				upsert: true,
				remove: false },
				function(err, result) {
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