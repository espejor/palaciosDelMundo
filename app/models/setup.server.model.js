
var mongoose = require('mongoose'),
	SchemaSetup = mongoose.Schema,
	SchemaUser = mongoose.Schema;


var SetupSchema = new SchemaSetup(
	{
		initInfo : String,
		photosCarousel : [{ url: String , title: String , txt: String }]
	});

mongoose.model('Setup', SetupSchema);

