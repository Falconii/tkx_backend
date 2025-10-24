const erroDB = require('../util/userfunctiondb');

exports.inscritos = function() { 
const parametros = { 
		nome:{check:true,require:true,maxLength:60},
		estrangeiro:{check:true,require:false,maxLength:1},
		sexo:{check:true,require:false,maxLength:1},
		data_nasc:{check:true,require:true},
		origem:{check:true,require:true},
	};
	return parametros; 
} 

