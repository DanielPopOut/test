module.exports = function (app,bcrypt,dateFormat,ObjectId,db) {
	//ici on a juste un id, mail et mdp
	var collectionName = 'event';
	var callAdress = '/event';
	var eventdb = db.collection(collectionName);
	var participantdb = db.collection('participant');

	//Récupérer un utilisateur en entrant son id dans la requete
	app.get('/event',function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.identifiant;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		eventdb.findOne(
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

	//Récupérer un utilisateur en entrant son id dans la requete
	app.get('/event/user',function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.id;
		var eventsToReturn;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		eventdb.find(
		   	{adminId: identifiant}).toArray(function(err, events) {
		   		console.log(events);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting' + collectionName + ' for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			eventsToReturn = eventsToReturn + events;
		   		}
		   	}
		);

		

		var eventIdList = participantdb.find( { guestId: identifiant }, { eventId: 1 }).toArray(function(err, events) {
		   		console.log(events);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting' + collectionName + ' for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			eventsToReturn = eventsToReturn + events;
		   		}
		   	}
		);

		for (var i = eventsToReturn.length - 1; i >= 0; i--) {
			var index = eventIdList.indexof(eventsToReturn[i]._id);
			console.log(eventIdList);
			console.log(eventsToReturn[i]._id)
			if(index>-1){
				eventIdList.splice(index,1);
				console.log("trouvé");
			}
		};

		for (var i = eventIdList.length - 1; i >= 0; i--) {
			eventIdList[i]=ObjectId(eventIdList[i]);
		};

		eventdb.find(
		   	{_id: { $in: eventIdList }}).toArray(function(err, events2) {
		   		console.log("events2 : " +  events2);
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting' + collectionName + ' for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			eventsToReturn = eventsToReturn + events2;
		   			console.log("eventsToReturn : " +  eventsToReturn);
		   			res.json({statut:1,data:eventsToReturn});

		   		}
		   	}
		);


	});


	app.put('/event',function(req,res){
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
	app.post('/event',function(req,res){
		var valueToInsert = req.body;
		valueToInsert.created = new Date();


		eventdb.insert(valueToInsert,function(err, result) {
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


	app.delete('/event',function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.identifiant;

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		eventdb.deleteOne(
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