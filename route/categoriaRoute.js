/* ROUTE categorias */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const categoriaSrv = require('../service/categoriaService');
router.use(autenticarToken); 
/* ROTA GETONE categoria */
router.get("/:id_empresa/:id",async function(req, res) {try 
	{
		const lsLista = await categoriaSrv.getCategoria(req.params.id_empresa,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Categoria Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'categoria', message: err.message });
		}
	}
})
/* ROTA GETALL categoria */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await categoriaSrv.getCategorias();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'categoria', message: err.message });
		}
	}
})
/* ROTA INSERT categoria */
router.post("/",async function(req, res) {try 
	{
		const categoria = req.body;
		const registro = await categoriaSrv.insertCategoria(categoria);		if (registro == null)
		{			res.status(409).json({ message: 'Categoria Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoria', message: err.message });
		}
	}
})
/* ROTA UPDATE categoria */
router.put("/",async function(req, res) {try 
	{
		const categoria = req.body;
		const registro = await categoriaSrv.updateCategoria(categoria);		if (registro == null)
		{			res.status(409).json({ message: 'Categoria Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoria', message: err.message });
		}
	}
})
/* ROTA DELETE categoria */
router.delete("/:id_empresa/:id",async function(req, res) {try 
	{
		await categoriaSrv.deleteCategoria(req.params.id_empresa,req.params.id);		res.status(200).json({ message: 'Categoria Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoria', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST categorias */
router.post("/categorias",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id":0, 
		"descricao":"", 
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
		const lsRegistros = await categoriaSrv.getCategorias(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Categoria Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Categoria', message: err.message });
		}
	}
})

module.exports = router;
