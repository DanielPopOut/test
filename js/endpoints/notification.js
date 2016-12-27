module.exports = function (app,bcrypt,dateFormat,ObjectId,db, sender) {
	//ici on a juste un id, mail et password
	var collectionName = 'notificationtoken';
	var callAdress = '/notificationtoken';
	var notificationdb = db.collection(collectionName);

		//enregistrer un utilisateur
	app.post(callAdress,function(req,res){
		var id = req.query.id;
		var notificationToken = req.body;
		notificationToken.created = new Date();
		notificationToken._id= ObjectId(id);
		console.log(notificationToken);

		notificationdb.update({_id: ObjectId(id)},
			notificationToken,
			{ upsert: true },
			function(err, result) {
			if(err) {
				console.log('********************************');
				console.log('Error while post' + collectionName);
				console.log(err);
				console.log('********************************');
				res.send(err);
			}else{
				res.json({statut:1,data:notificationToken});
			}	
		})
		});


}