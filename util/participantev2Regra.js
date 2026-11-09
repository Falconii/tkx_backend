const participantev2Srv = require('../service/participantev2Service');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
const peitoSrv = require('../service/peitoService');
const eventoSrv = require('../service/eventoService');

/*
  Participante so pode ser ALTERADO ou EXCLUIDO enquanto o evento estiver em 0 (Aguardando Liberacao)
  ou 1 (Aguardando Importacao). Excecao: a retirada do kit (rota de entrega) grava o id_entrega do
  participante com o evento ATIVO; esse chamador informa opcoes.origem = 'entrega'.
*/
async function exigeEventoEditavel(id_empresa, id_evento, acao) {
	const evento = await eventoSrv.getEvento(id_empresa, id_evento);
	if (evento == null) {
		throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"${acao}" Evento Não Existe Na Base De Dados.!` }]);
	}
	if (evento.status !== '0' && evento.status !== '1') {
		throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"${acao}" O participante só pode ser ${acao === 'EXCLUSÃO' ? 'excluído' : 'alterado'} quando o evento estiver Aguardando Liberação ou Aguardando Importação.` }]);
	}
}
/* REGRA DE NEGOCIO participantesv2 */

exports.participantev2_Inclusao = async function(participantev2) {
	try {
		const obj = await participantev2Srv.getParticipantev2(participantev2.id_empresa,participantev2.id_evento,participantev2.id);
		if (obj != null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
		// evento encerrado (4) nao recebe novos participantes
		const evento = await eventoSrv.getEvento(participantev2.id_empresa,participantev2.id_evento);
		if (evento == null) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"INCLUSÃO" Evento Não Existe Na Base De Dados.!` }]);
		}
		if (evento.status === '4') {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"INCLUSÃO" Evento Encerrado. Não é possível incluir novos participantes.` }]);
		}
		await peitoDaInclusao(participantev2);
	} catch (err) {
		throw err;
	}


	return;
}

exports.participantev2_Alteracao = async function(participantev2, opcoes = {}) {
	try {
		if (opcoes.origem !== 'entrega') {
			await exigeEventoEditavel(participantev2.id_empresa, participantev2.id_evento, 'ALTERAÇÃO');
		}
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
		await exigeEventoEditavel(id_empresa, id_evento, 'EXCLUSÃO');
	} catch (err) { 
		throw err; 
	}


	return; 
} 

