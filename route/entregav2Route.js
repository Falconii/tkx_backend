/* ROUTE entregasv2 */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const entregav2Srv = require('../service/entregav2Service');
router.use(autenticarToken); 
/* ROTA GETONE entregav2 */
router.get("/:id_empresa/:id_evento/:id",async function(req, res) {try 
	{
		const lsLista = await entregav2Srv.getEntregav2(req.params.id_empresa,req.params.id_evento,req.params.id);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Entregav2 Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'entregav2', message: err.message });
		}
	}
})
/* ROTA GETALL entregav2 */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await entregav2Srv.getEntregasv2();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'entregav2', message: err.message });
		}
	}
})
/* ROTA INSERT entregav2 */
router.post("/",async function(req, res) {try 
	{
		const entregav2 = req.body;
		const registro = await entregav2Srv.insertEntregav2(entregav2);		if (registro == null)
		{			res.status(409).json({ message: 'Entregav2 Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Entregav2', message: err.message });
		}
	}
})
/* ROTA UPDATE entregav2 */
router.put("/",async function(req, res) {try 
	{
		const entregav2 = req.body;
		const registro = await entregav2Srv.updateEntregav2(entregav2);		if (registro == null)
		{			res.status(409).json({ message: 'Entregav2 Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Entregav2', message: err.message });
		}
	}
})
/* ROTA DELETE entregav2 */
router.delete("/:id_empresa/:id_evento/:id",async function(req, res) {try 
	{
		await entregav2Srv.deleteEntregav2(req.params.id_empresa,req.params.id_evento,req.params.id);		res.status(200).json({ message: 'Entregav2 Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Entregav2', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST entregasv2 */
router.post("/entregasv2",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id_evento":0, 
		"id":0, 
		"id_recepcao":0, 
		"id_entrega":0, 
		"id_kit":0, 
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
		const lsRegistros = await entregav2Srv.getEntregasv2(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Entregav2 Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Entregav2', message: err.message });
		}
	}
})

module.exports = router;
