/* ROUTE entregas */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const entregaSrv = require('../service/entregaService');
router.use(autenticarToken); 
/* ROTA GETONE entrega */
router.get("/:id_empresa/:id_evento/:id_inscrito",async function(req, res) {try 
	{
		const lsLista = await entregaSrv.getEntrega(req.params.id_empresa,req.params.id_evento,req.params.id_inscrito);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Entrega Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'entrega', message: err.message });
		}
	}
})
/* ROTA GETALL entrega */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await entregaSrv.getEntregas();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'entrega', message: err.message });
		}
	}
})
/* ROTA INSERT entrega */
router.post("/",async function(req, res) {try 
	{
		const entrega = req.body;
		const registro = await entregaSrv.insertEntrega(entrega);		if (registro == null)
		{			res.status(409).json({ message: 'Entrega Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Entrega', message: err.message });
		}
	}
})
/* ROTA UPDATE entrega */
router.put("/",async function(req, res) {try 
	{
		const entrega = req.body;
		const registro = await entregaSrv.updateEntrega(entrega);		if (registro == null)
		{			res.status(409).json({ message: 'Entrega Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Entrega', message: err.message });
		}
	}
})
/* ROTA DELETE entrega */
router.delete("/:id_empresa/:id_evento/:id_inscrito",async function(req, res) {try 
	{
		await entregaSrv.deleteEntrega(req.params.id_empresa,req.params.id_evento,req.params.id_inscrito);		res.status(200).json({ message: 'Entrega Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Entrega', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST entregas */
router.post("/entregas",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id_evento":0, 
		"id_inscrito":0, 
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
		const lsRegistros = await entregaSrv.getEntregas(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Entrega Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Entrega', message: err.message });
		}
	}
})

module.exports = router;
