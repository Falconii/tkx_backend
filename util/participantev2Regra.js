const participantev2Srv = require('../service/participantev2Service');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
const peitoSrv = require('../service/peitoService');
/* REGRA DE NEGOCIO participantesv2 */

exports.participantev2_Inclusao = async function(participantev2) {
	try {
		const obj = await participantev2Srv.getParticipantev2(participantev2.id_empresa,participantev2.id_evento,participantev2.id);
		if (obj != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
		await peitoDaInclusao(participantev2);
	} catch (err) {
		throw err;
	}


	return;
}

exports.participantev2_Alteracao = async function(participantev2) {
	try {
		const obj = await participantev2Srv.getParticipantev2(participantev2.id_empresa,participantev2.id_evento,participantev2.id);
		if (obj == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		const peito = Number(participantev2.nro_peito);
		if (!(peito > 0)) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `Informe o Nº do peito.` }]);
		}
		// o peito e unico dentro do evento (a alteracao do proprio participante nao conta)
		const outro = await peitoSrv.participanteComPeito(participantev2.id_empresa,participantev2.id_evento,peito,participantev2.id);
		if (outro != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `Nº do peito ${peito} já está em uso neste evento (${outro.nome}).` }]);
		}
	} catch (err) {
		throw err;
	}


	return;
}

/* Peito da INCLUSAO: em branco = gerado pelo contador da categoria; informado = precisa ser unico no evento */
async function peitoDaInclusao(participantev2) {
	const peito = Number(participantev2.nro_peito);
	if (!(peito > 0)) {
		if (!(Number(participantev2.id_categoria) > 0)) {
			throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `Informe a categoria para gerar o Nº do peito automaticamente.` }]);
		}
		try {
			participantev2.nro_peito = await peitoSrv.proximoPeito({
				id_empresa: participantev2.id_empresa,
				id_evento: participantev2.id_evento,
				id_categoria: participantev2.id_categoria,
				id_usuario: participantev2.user_insert,
			});
		} catch (err) {
			throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: err.message }]);
		}
		return;
	}
	const outro = await peitoSrv.participanteComPeito(participantev2.id_empresa,participantev2.id_evento,peito,0);
	if (outro != null) {
		throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `Nº do peito ${peito} já está em uso neste evento (${outro.nome}).` }]);
	}
}

exports.participantev2_Exclusao = async function(id_empresa,id_evento,id) { 
	try { 
		const obj = await participantev2Srv.getParticipantev2(id_empresa,id_evento,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

