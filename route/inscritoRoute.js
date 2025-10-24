/* ROUTE inscritos */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const inscritoSrv = require('../service/inscritoService');
router.use(autenticarToken); 
/* ROTA GETONE inscrito */
router.get("/:id_empresa/:id",async function(req, res) {try 
	{
		const lsLista = await inscritoSrv.getInscrito(req.params.id_empresa,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Inscrito Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'inscrito', message: err.message });
		}
	}
})
/* ROTA GETALL inscrito */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await inscritoSrv.getInscritos();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'inscrito', message: err.message });
		}
	}
})
/* ROTA INSERT inscrito */
router.post("/",async function(req, res) {try 
	{
		const inscrito = req.body;
		const registro = await inscritoSrv.insertInscrito(inscrito);		if (registro == null)
		{			res.status(409).json({ message: 'Inscrito Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Inscrito', message: err.message });
		}
	}
})
/* ROTA UPDATE inscrito */
router.put("/",async function(req, res) {try 
	{
		const inscrito = req.body;
		const registro = await inscritoSrv.updateInscrito(inscrito);		if (registro == null)
		{			res.status(409).json({ message: 'Inscrito Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Inscrito', message: err.message });
		}
	}
})
/* ROTA DELETE inscrito */
router.delete("/:id_empresa/:id",async function(req, res) {try 
	{
		await inscritoSrv.deleteInscrito(req.params.id_empresa,req.params.id);		res.status(200).json({ message: 'Inscrito Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Inscrito', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST inscritos */
router.post("/inscritos",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id":0, 
		"nome":"", 
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
		const lsRegistros = await inscritoSrv.getInscritos(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Inscrito Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Inscrito', message: err.message });
		}
	}
})

module.exports = router;
