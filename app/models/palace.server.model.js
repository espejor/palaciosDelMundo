
var mongoose = require('mongoose'),
	SchemaPalace = mongoose.Schema,
	SchemaComment = mongoose.Schema, 
	SchemaPicture = mongoose.Schema;
	SchemaUser = mongoose.Schema;


var CommentSchema = new SchemaComment(
	{
		palace : {
			type: SchemaPalace.ObjectId, 
			ref: "Palace"
		},
		author: { type: SchemaUser.ObjectId, ref: 'User' },		
		date : {
			type: Date,
			default: Date.now
		},
		customerRate : {
			type: Number,
			max: 5,
			min: 0
		},
		title : String,
		text : String
	});

mongoose.model('Comment', CommentSchema);

//-----------------------------


var PictureSchema = new SchemaPicture(
	{
		palace: {
			type: SchemaPalace.ObjectId, 
			ref: "Palace"
		},
		url: {
			type: String,
			default: '',
			trim: true
		},
		comment: String
	}
);

mongoose.model('Picture', PictureSchema);

//-----------------------------

var PalaceSchema = new SchemaPalace(
	{
		name : {
			type:String,
			default: '',
			trim: true,
			required: 'El nombre del palacio no puede estár en blanco'
		},
		coord : {
			lat: {
				type: Number,
				required: 'Debe introducir la latitud del palacio',
				max: [90,'El valor máximo de la latitud es: 90'],
				min: [-90, 'El valor minimo de la latitud es: -90']
			},
			lng: {
				type: Number,
				required: 'Debe introducir la longitud del palacio',
				max: [180, 'El valor máximo de la longitud es: 180'],
				min: [-180, 'El valor minimo de la longitud es: -180']
			}
		},
		town : {
			type: String,
			default: '',
			trim: true,
			required: 'El nombre de la ciudad no puede estár en blanco'
		},
		country : {
			type: String,
			default: '',
			trim: true,
			required: 'El nombre del pais no puede estár en blanco'
		},
		picture : [
			{
				type: SchemaPicture.ObjectId, 
				ref: "Picture"
			}
		],
		type : {
			type: String,
			default: 'P',
			enum: ['P', 'C']
		},
		rate : {
			type: Number,
			max: 5,
			min: 0
		},
		resena : String,
		web: String,
		phone: String,
		email: String,
		address: String,

		comments : [
			{
				type: SchemaComment.ObjectId, 
				ref: "Comment"
			}
		]
	}
);

mongoose.model('Palace', PalaceSchema);