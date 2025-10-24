/* ROUTE categorias */
const db = require('../../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../middleware/autenticartoken');
const categoriaSrv = require('../../service/complementar/categoriaService');
router.use(autenticarToken); 
/* ROTA GETONE categoria */
router.get("/categoriabysigla/:id_empresa/:sigla",async function(req, res) {
try 
	{
		console.log("categoriabysigla")
		const lsLista = await categoriaSrv.getCategoriaBySigla(req.params.id_empresa,req.params.sigla);
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
module.exports = router;
