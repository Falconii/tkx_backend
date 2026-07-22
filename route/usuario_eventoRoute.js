/* ROUTE usuarios_eventos */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const usuario_eventoSrv = require('../service/usuario_eventoService');
router.use(autenticarToken); 
/* ROTA GETONE usuario_evento */
router.get("/:id_empresa/:id_evento/:id_usuario",async function(req, res) {try 
	{
		const lsLista = await usuario_eventoSrv.getUsuario_Evento(req.params.id_empresa,req.params.id_evento,req.params.id_usuario);
		if (lsLista == null) 
		{
			res.status(409).json({ message: 'Usuario_Evento Não Encontrada.' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'usuario_evento', message: err.message });
		}
	}
})
/* ROTA GETALL usuario_evento */
router.get("/",async function(req, res) {try 
	{
		const lsLista = await usuario_eventoSrv.getUsuarios_Eventos();
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'usuario_evento', message: err.message });
		}
	}
})
/* ROTA INSERT usuario_evento */
router.post("/",async function(req, res) {try 
	{
		const usuario_evento = req.body;
		const registro = await usuario_eventoSrv.insertUsuario_Evento(usuario_evento);		if (registro == null)
		{			res.status(409).json({ message: 'Usuario_Evento Cadastrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario_Evento', message: err.message });
		}
	}
})
/* ROTA UPDATE usuario_evento */
router.put("/",async function(req, res) {try 
	{
		const usuario_evento = req.body;
		const registro = await usuario_eventoSrv.updateUsuario_Evento(usuario_evento);		if (registro == null)
		{			res.status(409).json({ message: 'Usuario_Evento Alterado Com Sucesso!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario_Evento', message: err.message });
		}
	}
})
/* ROTA DELETE usuario_evento */
router.delete("/:id_empresa/:id_evento/:id_usuario",async function(req, res) {try 
	{
		await usuario_eventoSrv.deleteUsuario_Evento(req.params.id_empresa,req.params.id_evento,req.params.id_usuario);		res.status(200).json({ message: 'Usuario_Evento Excluído Com Sucesso!' });
}
catch (err)
	{
		if(err.name == 'MyExceptionDB')
		{
			res.status(409).json(err);
		}
		else
		{
			res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario_Evento', message: err.message });
		}
	}
})
/* ROTA CONSULTA POST usuarios_eventos */
router.post("/usuarios_eventos",async function(req, res) {/*
	{
		"id_empresa":0, 
		"id_evento":0, 
		"id_usuario":0, 
		"ativo":"", 
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
		const lsRegistros = await usuario_eventoSrv.getUsuarios_Eventos(params);		if (lsRegistros.length == 0)
		{			res.status(409).json({ message: 'Usuario_Evento Nenhum Registro Encontrado!' });
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
			res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario_Evento', message: err.message });
		}
	}
})

module.exports = router;
