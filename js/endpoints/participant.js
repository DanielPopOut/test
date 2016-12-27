module.exports = function (app,bcrypt,dateFormat,ObjectId,db, sender,gcm) {
	//ici on a juste un id, mail et mdp
	var gcm=require('node-gcm');;
	var collectionName = 'participant';
	var callAdress = '/participant';
	var participantdb = db.collection(collectionName);
	var notificationdb = db.collection('notificationtoken');

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
						});
						notificationdb.findOne({_id: ObjectId(participantToAdd.guestId)},function(err, notification) {
						   		console.log(notification);
						   		var registrationTokens = [];
						   		if(err){
						   			console.log('****************************');
						   			console.log('Error while getting notification for login');
						   			console.log('****************************');
						   			res.json({statut:-1});
						   		}else{
						   			var message = new gcm.Message();
									message.addNotification({
										title: participantToAdd.hostId + " t'invite à un event",
										icon: "ic_launcher",
									    body: "Ce sera ouf !"	
									});
					   				registrationTokens.push(notification.notificationtoken);
									sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
										if(err) console.error("error" + err);
										else    console.log(response);
									});
					   			
						   		}
						   	}
						);
				})(j);
			};

			

			console.log(registrationTokens);
			// registrationTokens.push('ci1EbtDch0s:APA91bFZ20d5HRsDrZ_SsyhxW3q63Z8XdhpApzZQNeFC--LRMok6-4cDWWfiZdzvjzbJEN7RNuqIjN-qObuJNzyZ06EROlBOc_Yn7TguK1EaXXA8uGByUGWKqpnD9UMQSHRxBrwSgFr8');
			
			res.json({statut:1});
		});

	function sendPartiipantNotification(){

	}

			//enregistrer un utilisateur
	app.post(callAdress+'/join',function(req,res){
			var joinParticipant = req.body;

			participantdb.findAndModify({eventId: joinParticipant.eventId, guestId: joinParticipant.guestId},
				[],
				{$set: {status:joinParticipant.status, guestName:joinParticipant.guestName, modified: new Date()} },
				{upsert: true, new:true},
				function(err, result) {
					if(err) {
						console.log('********************************');
						console.log('Error while inserting ' + collectionName);
						console.log(err);
						console.log('********************************');
			   			res.json({statut:-1});
					}else{
						res.json({statut:1,result:result});
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