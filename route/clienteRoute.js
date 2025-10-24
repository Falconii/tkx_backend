/*fontes clienteRoute.js*/

/* ROUTE cliente */
const express = require('express');
const router = express.Router(); 
const {autenticarToken} = require('../middleware/autenticartoken');

router.use(autenticarToken);


/* ROTA GETONE CLIENTE */
router.get("/:id",async function(req, res) {
try 
	{
		cliente = {
			id: 1,
			nome: "Marcos",
			email: "ooooo@gmail.com"}
		res.status(200).json(cliente);
	}
catch (err)
	{
	   res.status(500).json({ erro: 'BAK-END', tabela: 'Clientes', message: err.message });
	}
})/* ROTA INSERT credencial */
router.post("/",async function(req, res) {
try 
	{
		const cliente = req.body;

		if (cliente == null)
		{
			res.status(409).json({ message: 'Cliente Não Cadastrado!' });
		}
		else
		{
			res.status(200).json(cliente);
		}
}
catch (err)
	{
		
	   res.status(500).json({ erro: 'BAK-END', tabela: 'Clientes', message: err.message });

	}
})

module.exports = router;
