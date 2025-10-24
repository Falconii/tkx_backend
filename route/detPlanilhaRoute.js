/* ROUTE detPlanilhas */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const detPlanilhaSrv = require('../service/detPlanilhaService');
router.use(autenticarToken); 
/* ROTA GETONE detPlanilha */
router.get("/:id_empresa/:id_evento/:id_cabec/:cnpj_cpf",async function(req, res) {try 
	{
		const lsLista = await detPlanilhaSrv.getDetplanilha(req.params.id_empresa,req.params.id_evento,req.params.id_cabec,req.params.cnpj_cpf);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Detplanilha Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'detPlanilha', message: err.message });
		}
	}
})
/* ROTA GETALL detPlanilha */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await detPlanilhaSrv.getDetplanilhas();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'detPlanilha', message: err.message });
		}
	}
})
/* ROTA INSERT detPlanilha */
router.post("/",async function(req, res) {try 
	{
		const detPlanilha = req.body;
		const registro = await detPlanilhaSrv.insertDetplanilha(detPlanilha);		if (registro == null)
		{			res.status(409).json({ message: 'Detplanilha Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Detplanilha', message: err.message });
		}
	}
})
/* ROTA UPDATE detPlanilha */
router.put("/",async function(req, res) {try 
	{
		const detPlanilha = req.body;
		const registro = await detPlanilhaSrv.updateDetplanilha(detPlanilha);		if (registro == null)
		{			res.status(409).json({ message: 'Detplanilha Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Detplanilha', message: err.message });
		}
	}
})
/* ROTA DELETE detPlanilha */
router.delete("/:id_empresa/:id_evento/:id_cabec/:cnpj_cpf",async function(req, res) {try 
	{
		await detPlanilhaSrv.deleteDetplanilha(req.params.id_empresa,req.params.id_evento,req.params.id_cabec,req.params.cnpj_cpf);		res.status(200).json({ message: 'Detplanilha Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Detplanilha', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST detPlanilhas */
router.post("/detPlanilhas",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id_evento":0, 
		"id_cabec":0, 
		"cnpj_cpf":"0", 
		"nome":"", 
		"status":"-1", 
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
		const lsRegistros = await detPlanilhaSrv.getDetplanilhas(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Detplanilha Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Detplanilha', message: err.message });
		}
	}
})

module.exports = router;
