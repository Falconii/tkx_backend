/* ROUTE categoriacontadores */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const categoriacontadorSrv = require('../service/categoriacontadorService');
router.use(autenticarToken); 
/* ROTA GETONE categoriacontador */
router.get("/:id_empresa/:id_evento/:id_categoria",async function(req, res) {try 
	{
		const lsLista = await categoriacontadorSrv.getCategoriacontador(req.params.id_empresa,req.params.id_evento,req.params.id_categoria);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Categoriacontador Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'categoriacontador', message: err.message });
		}
	}
})
/* ROTA GETALL categoriacontador */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await categoriacontadorSrv.getCategoriacontadores();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'categoriacontador', message: err.message });
		}
	}
})
/* ROTA INSERT categoriacontador */
router.post("/",async function(req, res) {try 
	{
		const categoriacontador = req.body;
		const registro = await categoriacontadorSrv.insertCategoriacontador(categoriacontador);		if (registro == null)
		{			res.status(409).json({ message: 'Categoriacontador Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoriacontador', message: err.message });
		}
	}
})
/* ROTA UPDATE categoriacontador */
router.put("/",async function(req, res) {try 
	{
		const categoriacontador = req.body;
		const registro = await categoriacontadorSrv.updateCategoriacontador(categoriacontador);		if (registro == null)
		{			res.status(409).json({ message: 'Categoriacontador Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoriacontador', message: err.message });
		}
	}
})
/* ROTA DELETE categoriacontador */
router.delete("/:id_empresa/:id_evento/:id_categoria",async function(req, res) {try 
	{
		await categoriacontadorSrv.deleteCategoriacontador(req.params.id_empresa,req.params.id_evento,req.params.id_categoria);		res.status(200).json({ message: 'Categoriacontador Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoriacontador', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST categoriacontadores */
router.post("/categoriacontadores",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id_evento":0, 
		"id_categoria":0, 
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
		const lsRegistros = await categoriacontadorSrv.getCategoriacontadores(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Categoriacontador Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoriacontador', message: err.message });
		}
	}
})

module.exports = router;
