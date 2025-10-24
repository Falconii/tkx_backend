/* SERVICE eventos */
const trocaParticipanteData = require('../data/complementar/participanteData');
const validacao = require('../util/validacao');
const parametros = require('../util/eventoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/eventoRegra');
const TABELA = 'TROCA_INSCRITO';
/* CRUD GET SERVICE */
exports.trocaParticipante = async function(params){
    return trocaParticipanteData.trocaInscrito(params);
}



/* CRUD GET SERVICE */
exports.trocarParticipante = async function(participante,newInscrito){
    return trocaParticipanteData.trocarParticipante(participante,newInscrito);
}

