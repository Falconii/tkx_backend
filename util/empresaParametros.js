const erroDB = require('../util/userfunctiondb');

exports.empresas = function() { 
const parametros = { 
		razao:{check:true,require:true,maxLength:40},
		fantasi:{check:true,require:false,maxLength:40},
		inscri:{check:true,require:false,maxLength:14},
	};
	return parametros; 
} 

