/* ROUTE participantes */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const participanteSrv = require('../service/participanteService');
router.use(autenticarToken); 
/* ROTA GETONE participante */
router.get("/:id_empresa/:id_evento/:id_inscrito/:inscricao",async function(req, res) {try 
	{
		const lsLista = await participanteSrv.getParticipante(req.params.id_empresa,req.params.id_evento,req.params.id_inscrito,req.params.inscricao);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Participante Não Encontrada.' });
		}
	else
		{
			res.status(200).json(lsLista);
		}
	}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'participante', message: err.message });
		}
	}
})
/* ROTA GETALL participante */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await participanteSrv.getParticipantes();
		if (lsLista.length == 0) 
		{
			res.status(409).json({ message: 'Nehuma Informação Para Esta Consulta.'} );
		}
	else
		{
			res.status(200).json(lsLista);
		}
	}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'participante', message: err.message });
		}
	}
})
/* ROTA INSERT participante */
router.post("/",async function(req, res) {try 
	{
		const participante = req.body;
		const registro = await participanteSrv.insertParticipante(participante);		if (registro == null)
		{			res.status(409).json({ message: 'Participante Cadastrado!' });
		}
		else
		{
			res.status(200).json(registro);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Participante', message: err.message });
		}
	}
})
/* ROTA UPDATE participante */
router.put("/",async function(req, res) {try 
	{
		const participante = req.body;
		const registro = await participanteSrv.updateParticipante(participante);		if (registro == null)
		{			res.status(409).json({ message: 'Participante Alterado Com Sucesso!' });
		}
		else
		{
			res.status(200).json(registro);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Participante', message: err.message });
		}
	}
})
/* ROTA DELETE participante */
router.delete("/:id_empresa/:id_evento/:id_inscrito/:inscricao",async function(req, res) {try 
	{
		await participanteSrv.deleteParticipante(req.params.id_empresa,req.params.id_evento,req.params.id_inscrito,req.params.inscricao);		res.status(200).json({ message: 'Participante Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Participante', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST participantes */
router.post("/participantes",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id_evento":0, 
		"id_inscrito":0, 
		"inscricao":0, 
		"nro_peito":0, 
		"id_categoria":0, 
		"evento_descricao":"", 
		"inscrito_nome":"", 
		"inscrito_cpf":"", 
		"categoria_descricao":"", 
		"id_old_inscrito":, 
		"pagina":0, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false 
	}
*/
try 
	{
		const params = req.body;
		const lsRegistros = await participanteSrv.getParticipantes(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Participante Nenhum Registro Encontrado!' });
		}
		else
		{
			res.status(200).json(lsRegistros);
		}
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Participante', message: err.message });
		}
	}
})

module.exports = router;
