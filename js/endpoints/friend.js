module.exports = function (app,bcrypt,dateFormat,ObjectId,db) {
	//ici on a juste un id, mail et mdp
	var collectionName = 'friend';
	var callAdress = '/friend';
	var frienddb = db.collection(collectionName);
	var userdb = db.collection('user');

	//Récupérer un utilisateur en entrant son id dans la requete
	app.get(callAdress,function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.id;
		var friendId_list = [];

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		frienddb.find(
		   	{ $or: [ { user1Id: identifiant }, { user2Id: identifiant } ] } ).toArray(function(err, docs) {
		   		console.log(docs);
		   		if(err){
					console.log('****************************');
		   			console.log('Error while getting user for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
				}else{
					if(docs.length>0){
						//SI ON A UN RESULTAT
						res.json({statut:1,data:docs});
					}else{
						//SI ON N'A PAS DE RESULTATS
						res.json({statut:0});
					}
				}
		   	})
	});


app.get(callAdress+'/real',function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.id;
		var friendId_list = [];

		//POUR RECUPERER UN ET UN SEUL UTILISATEUR
		frienddb.find(
		   	{ $or: [ { user1Id: identifiant }, { user2Id: identifiant } ] }, {status: 1} ).toArray(function(err, docs) {
		   		console.log(docs);
		   		if(err){
					console.log('****************************');
		   			console.log('Error while getting user for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
				}else{
					if(docs.length>0){
						//SI ON A UN RESULTAT
						res.json({statut:1,data:docs});
					}else{
						//SI ON N'A PAS DE RESULTATS
						res.json({statut:0});
					}
				}
		   	})
	});



	app.put(callAdress,function(req,res){
		var valueToInsert = req.body;
		valueToInsert.created = new Date();
		valueToInsert.modified = new Date();
		var identifiant = req.query.id;
		console.log(ObjectId(identifiant));
		console.log(valueToInsert._id);
		frienddb.update({_id: ObjectId(valueToInsert._id)},
			{$set: {state: valueToInsert.state}},
			function(err, result) {
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
		var friendToInsert = req.body;

		if(friendToInsert.user1Id==friendToInsert.user2Id){
			res.json({statut:10, result:"impossible to be friend with yourself ;)"});
		}else{
			frienddb.findOne({$or: [ 
				{ user1Id: friendToInsert.user1Id, user2Id: friendToInsert.user2Id }, 
				{ user1Id: friendToInsert.user2Id, user2Id: friendToInsert.user1Id }
				]},
				function(err, friendFound) {
		   		if(err){
		   			console.log('****************************');
		   			console.log('Error while getting user for login');
		   			console.log('****************************');
		   			res.json({statut:-1});
		   		}else{
		   			console.log(friendFound);
		   			if (friendFound!=null){
		   				if (friendFound.state=="1"){
		   					res.json({statut:10,result:"you are already friends"});
		   				}else {
		   					friendToInsert.modified=new Date();
		   					friendToInsert.created = new Date();
		   					frienddb.update({_id: friendFound._id},
		   						friendToInsert,
		   						{ upsert: false },
		   						function(err, result) {
									if(err) {
										console.log('********************************');
										console.log('Error while inserting user');
										console.log(err);
										console.log('********************************');
										res.send(err);
									}else{
										res.json({statut:1,data:result });
									}	
								})
		   				}
		   			}else {
		   				friendToInsert.created = new Date();
		   				frienddb.insert(friendToInsert,function(err, result) {
							if(err) {
								console.log('********************************');
								console.log('Error while inserting user');
								console.log(err);
								console.log('********************************');
								res.send(err);
							}else{
								res.json({statut:1,data:result});
							}	
						})
		   			}

		   		}
		   	});


			// frienddb.findAndModify({$or: [ { user1Id: valueToInsert.user1Id, user2Id: valueToInsert.user2Id }, { user1Id: valueToInsert.user2Id, user2Id: valueToInsert.user1Id }] },
			// 	[],
			// 	{$set: { modified: new Date()}},
			// 	{upsert: true, new:true},
			// 	function(err, result) {
			// 		if(err) {
			// 			console.log('********************************');
			// 			console.log('Error while post' + collectionName);
			// 			console.log(err);
			// 			console.log('********************************');
			// 			res.send(err);
			// 		}else{
			// 			res.json({statut:1,data:result});
			// 		}	
			// 	}
			// )
		}
		
		});


	app.delete(callAdress,function(req,res){
		// res.json({statut:1});
		//RECUPERER UN UTILISATEUR AVEC SON IDENTIFIANT
		var identifiant = req.query.id;

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