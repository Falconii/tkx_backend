/* ROUTE participantesv2 */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const participantev2Srv = require('../service/participantev2Service');
router.use(autenticarToken); 
/* ROTA GETONE participantev2 */
router.get("/:id_empresa/:id_evento/:id",async function(req, res) {try 
	{
		const lsLista = await participantev2Srv.getParticipantev2(req.params.id_empresa,req.params.id_evento,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Participantev2 Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'participantev2', message: err.message });
		}
	}
})
/* ROTA GETALL participantev2 */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await participantev2Srv.getParticipantesv2();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'participantev2', message: err.message });
		}
	}
})
/* ROTA INSERT participantev2 */
router.post("/",async function(req, res) {try 
	{
		const participantev2 = req.body;
		const registro = await participantev2Srv.insertParticipantev2(participantev2);		if (registro == null)
		{			res.status(409).json({ message: 'Participantev2 Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Participantev2', message: err.message });
		}
	}
})
/* ROTA UPDATE participantev2 */
router.put("/",async function(req, res) {try 
	{
		const participantev2 = req.body;
		const registro = await participantev2Srv.updateParticipantev2(participantev2);		if (registro == null)
		{			res.status(409).json({ message: 'Participantev2 Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Participantev2', message: err.message });
		}
	}
})
/* ROTA DELETE participantev2 */
router.delete("/:id_empresa/:id_evento/:id",async function(req, res) {try 
	{
		await participantev2Srv.deleteParticipantev2(req.params.id_empresa,req.params.id_evento,req.params.id);		res.status(200).json({ message: 'Participantev2 Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Participantev2', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST participantesv2 */
router.post("/participantesv2",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id_evento":0, 
		"id":0, 
		"inscricao":0, 
		"nro_peito":0, 
		"id_categoria":0, 
		"nome":"", 
		"cnpj_cpf":"", 
		"evento_descricao":"", 
		"categoria_descricao":"", 
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
		const lsRegistros = await participantev2Srv.getParticipantesv2(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Participantev2 Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Participantev2', message: err.message });
		}
	}
})

module.exports = router;
