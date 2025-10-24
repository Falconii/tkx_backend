/* ROUTE categoriacontadores */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const categoriacontadoresSrv = require('../service/categoriacontadoresService');
router.use(autenticarToken); 
/* ROTA GETONE categoriacontadores */
router.get("/:id_empresa/:id_evento/:id_categoria",async function(req, res) {try 
	{
		const lsLista = await categoriacontadoresSrv.getCategoriacontadores(req.params.id_empresa,req.params.id_evento,req.params.id_categoria);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Categoriacontadores Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'categoriacontadores', message: err.message });
		}
	}
})
/* ROTA GETALL categoriacontadores */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await categoriacontadoresSrv.getCategoriacontador();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'categoriacontadores', message: err.message });
		}
	}
})
/* ROTA INSERT categoriacontadores */
router.post("/",async function(req, res) {try 
	{
		const categoriacontadores = req.body;
		const registro = await categoriacontadoresSrv.insertCategoriacontadores(categoriacontadores);		if (registro == null)
		{			res.status(409).json({ message: 'Categoriacontadores Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoriacontadores', message: err.message });
		}
	}
})
/* ROTA UPDATE categoriacontadores */
router.put("/",async function(req, res) {try 
	{
		const categoriacontadores = req.body;
		const registro = await categoriacontadoresSrv.updateCategoriacontadores(categoriacontadores);		if (registro == null)
		{			res.status(409).json({ message: 'Categoriacontadores Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoriacontadores', message: err.message });
		}
	}
})
/* ROTA DELETE categoriacontadores */
router.delete("/:id_empresa/:id_evento/:id_categoria",async function(req, res) {try 
	{
		await categoriacontadoresSrv.deleteCategoriacontadores(req.params.id_empresa,req.params.id_evento,req.params.id_categoria);		res.status(200).json({ message: 'Categoriacontadores Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoriacontadores', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST categoriacontadores */
router.post("/categoriacontador",async function(req, res) {/*
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
		const lsRegistros = await categoriacontadoresSrv.getCategoriacontador(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Categoriacontadores Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoriacontadores', message: err.message });
		}
	}
})

module.exports = router;
