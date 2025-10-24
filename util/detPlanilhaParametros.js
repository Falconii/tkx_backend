const erroDB = require('../util/userfunctiondb');

exports.detPlanilhas = function() { 
const parametros = { 
		nome:{check:true,require:true,maxLength:60},
		estrangeiro:{check:true,require:false,maxLength:1},
		sexo:{check:true,require:false,maxLength:1},
	};
	return parametros; 
} 

