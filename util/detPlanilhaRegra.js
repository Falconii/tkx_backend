const detPlanilhaSrv = require('../service/detPlanilhaService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
const peitoSrv = require('../service/peitoService');
/* REGRA DE NEGOCIO detPlanilhas */

exports.detPlanilha_Inclusao = async function(detPlanilha) {
	try {
		const peito = Number(detPlanilha.nro_peito);
		if (!(peito > 0)) {
			// peito em branco: gerado pelo contador da categoria
			if (!(Number(detPlanilha.id_categoria) > 0)) {
				throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `Informe a categoria para gerar o Nº do peito automaticamente.` }]);
			}
			try {
				detPlanilha.nro_peito = await peitoSrv.proximoPeito({
					id_empresa: detPlanilha.id_empresa,
					id_evento: detPlanilha.id_evento,
					id_categoria: detPlanilha.id_categoria,
					id_usuario: detPlanilha.user_insert,
				});
			} catch (err) {
				throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: err.message }]);
			}
		} else {
			const obj = await detPlanilhaSrv.getDetplanilha(detPlanilha.id_empresa,detPlanilha.id_evento,detPlanilha.id_cabec,detPlanilha.nro_peito);
			if (obj != null) {
			   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
			}
			// o peito e unico dentro do evento: participantes e linhas de OUTRAS planilhas
			const participante = await peitoSrv.participanteComPeito(detPlanilha.id_empresa,detPlanilha.id_evento,peito,0);
			if (participante != null) {
			   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `Nº do peito ${peito} já está em uso neste evento (participante ${participante.nome}).` }]);
			}
			const outraPlanilha = await peitoSrv.linhaDePlanilhaComPeito(detPlanilha.id_empresa,detPlanilha.id_evento,peito,detPlanilha.id_cabec);
			if (outraPlanilha != null) {
			   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `Nº do peito ${peito} já está em uso neste evento (planilha ${outraPlanilha.id_cabec}).` }]);
			}
		}
	} catch (err) {
		throw err;
	}


	return;
}

exports.detPlanilha_Alteracao = async function(detPlanilha) { 
	try { 
		const obj = await detPlanilhaSrv.getDetplanilha(detPlanilha.id_empresa,detPlanilha.id_evento,detPlanilha.id_cabec,detPlanilha.nro_peito);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.detPlanilha_Exclusao = async function(id_empresa,id_evento,id_cabec,nro_peito) { 
	try { 
		const obj = await detPlanilhaSrv.getDetplanilha(id_empresa,id_evento,id_cabec,nro_peito);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

