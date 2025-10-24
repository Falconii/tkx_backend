/* ROUTE empresas */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const empresaSrv = require('../service/empresaService');
router.use(autenticarToken); 
/* ROTA GETONE empresa */
router.get("/:id",async function(req, res) {try 
	{
		const lsLista = await empresaSrv.getEmpresa(req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Empresa Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'empresa', message: err.message });
		}
	}
})
/* ROTA GETALL empresa */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await empresaSrv.getEmpresas();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'empresa', message: err.message });
		}
	}
})
/* ROTA INSERT empresa */
router.post("/",async function(req, res) {try 
	{
		const empresa = req.body;
		const registro = await empresaSrv.insertEmpresa(empresa);		if (registro == null)
		{			res.status(409).json({ message: 'Empresa Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Empresa', message: err.message });
		}
	}
})
/* ROTA UPDATE empresa */
router.put("/",async function(req, res) {try 
	{
		const empresa = req.body;
		const registro = await empresaSrv.updateEmpresa(empresa);		if (registro == null)
		{			res.status(409).json({ message: 'Empresa Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Empresa', message: err.message });
		}
	}
})
/* ROTA DELETE empresa */
router.delete("/:id",async function(req, res) {try 
	{
		await empresaSrv.deleteEmpresa(req.params.id);		res.status(200).json({ message: 'Empresa Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Empresa', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST empresas */
router.post("/empresas",async function(req, res) {/*
	{
		"id":0, 
		"razao":"", 
		"cnpj_cpf":"", 
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
		const lsRegistros = await empresaSrv.getEmpresas(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Empresa Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Empresa', message: err.message });
		}
	}
})

module.exports = router;
