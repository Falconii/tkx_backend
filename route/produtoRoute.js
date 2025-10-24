/*fontes produtoRoute.js*/

/* ROUTE produtos */
const express = require('express');
const router = express.Router(); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {autenticarToken} = require('../middleware/autenticartoken');

router.use(autenticarToken);




/* ROTA GETONE PRODUTO */
router.get("/:id",async function(req, res) {
try 
	{		
		produto = {
			id: 1,
			descricao: "CAIXA DE CERVEJA",
			unid: "CX"}
		res.status(200).json(produto);
	}
catch (err)
	{
	   res.status(500).json({ erro: 'BAK-END', tabela: 'Produtos', message: err.message });
	}
})/* ROTA INSERT credencial */
router.post("/",async function(req, res) {
try 
	{
		const produto = req.body;

		if (cliente == null)
		{
			res.status(409).json({ message: 'Produto Não Cadastrado!' });
		}
		else
		{
			res.status(200).json(produto);
		}
}
catch (err)
	{
		
	   res.status(500).json({ erro: 'BAK-END', tabela: 'Produtos', message: err.message });

	}
})
router.post("/relaotorioGeral",async function(req, res) {
try 
	{
		const resposta = {"mensagem": "Relaotorio Geral de Produtos!"};
		{
			res.status(200).json(resposta);
		}
}
catch (err)
	{
		
	   res.status(500).json({ erro: 'BAK-END', tabela: 'Produtos', message: err.message });

	}
})
module.exports = router;
