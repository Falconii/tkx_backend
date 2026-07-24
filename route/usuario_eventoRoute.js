/* ROUTE usuarios_eventos */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const usuario_eventoSrv = require('../service/usuario_eventoService');
const usuarioComplentarSrv = require('../service/complementar/usuarioService');
const usuarioSrv = require('../service/usuarioService');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('../util/shared'); 

router.use(autenticarToken); 
/* ROTA GETONE usuario_evento */
router.get("/:id_empresa/:id_evento/:cnpj_cpf",async function(req, res) {
try 
	{
		const lsLista = await usuario_eventoSrv.getUsuario_Evento(req.params.id_empresa,req.params.id_evento,req.params.cnpj_cpf);
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
router.get("/",async function(req, res) {
try 
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
router.post("/",async function(req, res) {
try 
	{
		const usuario_evento = req.body;
		const id_usuario     = req.id_usuario;

		let usu = await usuarioComplentarSrv.getUsuarioByCpf(usuario_evento.id_empresa,usuario_evento.cnpj_cpf);

		if (usu !== null) {

           if (usu.grupo !== 4){

			   res.status(500).json({ erro: 'BAK-END', tabela: 'Usuario_Evento', message: 'Usuário Já Existem E Não É Do Grupo De Operadores' });

			   return ;
		   }

		}

		const user = await usuario_eventoSrv.insertUsuario_Evento(usuario_evento);

		if (user == null)
		{
			res.status(409).json({ message: 'Usuario_Evento Não Cadastrado!' });
		}
		else
		{
			const senhaNova = "mudarsenha";
			
			const hashedPassword = await bcrypt.hash(senhaNova, 10);
			
			if (usu == null) {
					const hoje = new Date();
					const userModel = {
							id_empresa: user.id_empresa,
							id: 0,
							cnpj_cpf: user.cnpj_cpf,
							razao:user.razao,
							cadastr:hoje.ddmmyyyy(),
							rua: '',
							nro: '',
							complemento: '',
							bairro: '',
							cidade: '',
							uf: '',
							cep: '',
							tel1: '',
							tel2: '',
							email: '',
							obs: '',
							senha: hashedPassword,
							grupo: 4,
							ativo: 'S',
							trocarsenha: 'S',
							user_insert: id_usuario,
							user_update: 0
					}
					usu = await usuarioSrv.insertUsuario(userModel);
					user.id_usuario = usu.id;
					await usuario_eventoSrv.updateUsuario_Evento(user);
			} else {
				    
					usu.razao = user.razao;
					usu = await usuarioSrv.updateUsuario(usu);
			}
			res.status(200).json(user);
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
router.put("/",async function(req, res) {
try 
	{
		console.log("Cheguei aqui....");
		const usuario_evento = req.body;
		
		const id_usuario     = req.id_usuario;

		const user = await usuario_eventoSrv.updateUsuario_Evento(usuario_evento);
		if (user == null)
		{
			res.status(409).json({ message: 'Falha Na Alteração Do Usuário Evento!' });
		}
		else
		{
			let usu = await usuarioComplentarSrv.getUsuarioByCpf(user.id_empresa,user.cnpj_cpf);
			usu.razao = user.razao;
			usu = await usuarioSrv.updateUsuario(usu);
			res.status(200).json(user);
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
router.delete("/:id_empresa/:id_evento/:cnpj_cpf",async function(req, res) {
try 
	{
		await usuario_eventoSrv.deleteUsuario_Evento(req.params.id_empresa,req.params.id_evento,req.params.cnpj_cpf);
		res.status(200).json({ message: 'Usuario_Evento Excluído Com Sucesso!' });
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
router.post("/usuarios_eventos",async function(req, res) {
/*
	{
		"id_empresa":0, 
		"id_evento":0, 
		"cnpj_cpf":"", 
		"razao":"", 
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
		const lsRegistros = await usuario_eventoSrv.getUsuarios_Eventos(params);
		if (lsRegistros.length == 0)
		{
			res.status(409).json({ message: 'Usuario_Evento Nenhum Registro Encontrado!' });
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
