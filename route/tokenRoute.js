/* ROUTE tokens */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const tokenSrv = require('../service/tokenService');

/* ROTA GETONE token */
router.get("/api/token/:id_empresa/:token/:tipo/:id_usuario",async function(req, res) {
try 
	{
		const lsLista = await tokenSrv.getToken(req.params.id_empresa,req.params.token,req.params.tipo,req.params.id_usuario);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Token Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'token', message: err.message });
		}
	}
})
/* ROTA GETALL token */
router.get("/api/tokens",async function(req, res) {
try 
	{
		const lsLista = await tokenSrv.getTokens();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'token', message: err.message });
		}
	}
})
/* ROTA INSERT token */
router.post("/api/token",async function(req, res) {
try 
	{
		const token = req.body;
		const registro = await tokenSrv.insertToken(token);
		if (registro == null)
		{
			res.status(409).json({ message: 'Token Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Token', message: err.message });
		}
	}
})
/* ROTA UPDATE token */
router.put("/api/token",async function(req, res) {
try 
	{
		const token = req.body;
		const registro = await tokenSrv.updateToken(token);
		if (registro == null)
		{
			res.status(409).json({ message: 'Token Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Token', message: err.message });
		}
	}
})
/* ROTA DELETE token */
router.delete("/api/token/:id_empresa/:token/:tipo/:id_usuario",async function(req, res) {
try 
	{
		await tokenSrv.deleteToken(req.params.id_empresa,req.params.token,req.params.tipo,req.params.id_usuario);
		res.status(200).json({ message: 'Token Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Token', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST tokens */
router.post("/api/tokens",async function(req, res) {
/*
	{
		"id_empresa":, 
		"token":"", 
		"tipo":"", 
		"id_usuario":"" 
	}
*/
try 
	{
		const params = req.body;
		const lsRegistros = await tokenSrv.getTokens(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Token Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Token', message: err.message });
		}
	}
})

module.exports = router;
