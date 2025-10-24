/* ROUTE links */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const linkSrv = require('../service/linkService');
router.use(autenticarToken); 
/* ROTA GETONE link */
router.get("/:id_empresa/:id_evento/:id_inscrito",async function(req, res) {try 
	{
		const lsLista = await linkSrv.getLink(req.params.id_empresa,req.params.id_evento,req.params.id_inscrito);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Link Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'link', message: err.message });
		}
	}
})
/* ROTA GETALL link */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await linkSrv.getLnks();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'link', message: err.message });
		}
	}
})
/* ROTA INSERT link */
router.post("/",async function(req, res) {try 
	{
		const link = req.body;
		const registro = await linkSrv.insertLink(link);		if (registro == null)
		{			res.status(409).json({ message: 'Link Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Link', message: err.message });
		}
	}
})
/* ROTA UPDATE link */
router.put("/",async function(req, res) {try 
	{
		const link = req.body;
		const registro = await linkSrv.updateLink(link);		if (registro == null)
		{			res.status(409).json({ message: 'Link Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Link', message: err.message });
		}
	}
})
/* ROTA DELETE link */
router.delete("/:id_empresa/:id_evento/:id_inscrito",async function(req, res) {try 
	{
		await linkSrv.deleteLink(req.params.id_empresa,req.params.id_evento,req.params.id_inscrito);		res.status(200).json({ message: 'Link Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Link', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST links */
router.post("/lnks",async function(req, res) {/*
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
		const lsRegistros = await linkSrv.getLnks(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Link Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Link', message: err.message });
		}
	}
})

module.exports = router;
