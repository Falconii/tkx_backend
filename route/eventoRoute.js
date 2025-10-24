/* ROUTE eventos */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const eventoSrv = require('../service/eventoService');
router.use(autenticarToken); 
/* ROTA GETONE evento */
router.get("/:id_empresa/:id",async function(req, res) {try 
	{
		const lsLista = await eventoSrv.getEvento(req.params.id_empresa,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Evento Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'evento', message: err.message });
		}
	}
})
/* ROTA GETALL evento */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await eventoSrv.getEventos();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'evento', message: err.message });
		}
	}
})
/* ROTA INSERT evento */
router.post("/",async function(req, res) {try 
	{
		const evento = req.body;
		const registro = await eventoSrv.insertEvento(evento);		if (registro == null)
		{			res.status(409).json({ message: 'Evento Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Evento', message: err.message });
		}
	}
})
/* ROTA UPDATE evento */
router.put("/",async function(req, res) {try 
	{
		const evento = req.body;
		const registro = await eventoSrv.updateEvento(evento);		if (registro == null)
		{			res.status(409).json({ message: 'Evento Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Evento', message: err.message });
		}
	}
})
/* ROTA DELETE evento */
router.delete("/:id_empresa/:id",async function(req, res) {try 
	{
		await eventoSrv.deleteEvento(req.params.id_empresa,req.params.id);		res.status(200).json({ message: 'Evento Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Evento', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST eventos */
router.post("/eventos",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id":0, 
		"descricao":"", 
		"id_responsavel":0, 
		"status":"", 
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
		const lsRegistros = await eventoSrv.getEventos(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Evento Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Evento', message: err.message });
		}
	}
})

module.exports = router;
