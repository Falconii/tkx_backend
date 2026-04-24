const erroDB = require('../util/userfunctiondb');

exports.participantesv2 = function() { 
const parametros = { 
		nome:{check:true,require:true,maxLength:60},
		sexo:{check:true,require:false,maxLength:1},
		data_nasc:{check:true,require:true},
		origem:{check:true,require:true},
	};
	return parametros; 
} 

