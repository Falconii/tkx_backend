/* ROUTE parametros */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const parametroSrv = require('../service/parametroService');
router.use(autenticarToken); 
/* ROTA GETONE parametro */
router.get("/:id_empresa/:modulo/:assinatura/:id_usuario",async function(req, res) {try 
	{
		const lsLista = await parametroSrv.getParametro(req.params.id_empresa,req.params.modulo,req.params.assinatura,req.params.id_usuario);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Parametro Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'parametro', message: err.message });
		}
	}
})
/* ROTA GETALL parametro */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await parametroSrv.getParametros();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'parametro', message: err.message });
		}
	}
})
/* ROTA INSERT parametro */
router.post("/",async function(req, res) {try 
	{
		const parametro = req.body;
		const registro = await parametroSrv.insertParametro(parametro);		if (registro == null)
		{			res.status(409).json({ message: 'Parametro Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Parametro', message: err.message });
		}
	}
})
/* ROTA UPDATE parametro */
router.put("/",async function(req, res) {try 
	{
		const parametro = req.body;
		const registro = await parametroSrv.updateParametro(parametro);		if (registro == null)
		{			res.status(409).json({ message: 'Parametro Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Parametro', message: err.message });
		}
	}
})
/* ROTA DELETE parametro */
router.delete("/:id_empresa/:modulo/:assinatura/:id_usuario",async function(req, res) {try 
	{
		await parametroSrv.deleteParametro(req.params.id_empresa,req.params.modulo,req.params.assinatura,req.params.id_usuario);		res.status(200).json({ message: 'Parametro Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Parametro', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST parametros */
router.post("/parametros",async function(req, res) {/*
	{
		"id_empresa":0, 
		"modulo":"", 
		"assinatura":"", 
		"id_usuario":0, 
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
		const lsRegistros = await parametroSrv.getParametros(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Parametro Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Parametro', message: err.message });
		}
	}
})

module.exports = router;
