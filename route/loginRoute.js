/* ROUTE credenciais */
const express = require('express');
const router = express.Router(); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioService = require('../service/usuarioService');
const tokenService = require('../service/tokenService');


/* Login */
router.post("/",async function(req, res) {
try 
	{
	   const { id_empresa,codigo, password } = req.body;

       console.log("Login:", codigo, password);

	   user = await usuarioService.getUsuario(id_empresa,codigo);

	   console.log("User:", user);


	  if (!user) {
		  return res.status(403).send('Credenciais inválidas');
	  }


	  if (!user || !bcrypt.compareSync(password, user.senha)) {
         return res.status(401).send('Credenciais inválidas');
      }

	  console.log("Senha valida:", user.senha);

	  await tokenService.deleteTokenByUser(user.id_empresa, user.id);

      const accessToken = tokenService.generateAccessToken(user);

	   const refreshToken = tokenService.generateRefreshToken(user);


		await tokenService.insertToken({
				id_empresa: user.id_empresa,
				token: accessToken,
				tipo: 'A',
				validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
				id_usuario: user.id,
				status: 1,
				user_insert: user.id,
				user_update: 0
		});

		await tokenService.insertToken({
				id_empresa: user.id_empresa,
				token: refreshToken,
				tipo: 'R',
				validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
				id_usuario: user.id,
				status: 1,
				user_insert: user.id,
				user_update: 0
		});

		res.status(200).json({"id_empresa":user.id_empresa, "id": user.id, "razao":user.razao,"accessToken": accessToken, "refreshToken": refreshToken});

	}
catch (err)
	{
	   res.status(500).json({ erro: 'BAK-END',  message: err.message});
	}
})

router.post("refresh/",async function(req, res) {
try 
	{
	   const { codigo, password } = req.body;

	   user = await usuarioService.getUsuario(1,codigo);

	   if (!user) {
		  return res.status(403).send('Credenciais inválidas');
	   }

	   if (!user || !bcrypt.compareSync(password, user.senha)) {
          return res.status(401).send('Credenciais inválidas');
       }

	   await tokenService.deleteTokenByUser(user.id_empresa, user.id);

       const accessToken = tokenService.generateAccessToken(user);

	   const refreshToken = tokenService.generateRefreshToken(user);

		await tokenService.insertToken({
				id_empresa: user.id_empresa,
				token: accessToken,
				tipo: 'A',
				validade: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
				id_usuario: user.id,
				status: 1,
				user_insert: user.id,
				user_update: 0
		});

		await tokenService.insertToken({
				id_empresa: user.id_empresa,
				token: refreshToken,
				tipo: 'R',
				validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
				id_usuario: user.id,
				status: 1,
				user_insert: user.id,
				user_update: 0
		});

		res.status(200).json({"id_empresa":user.id_empresa,"id_usuario": user.id, "razao":user.razao,"accessToken": accessToken, "refreshToken": refreshToken});

	}
catch (err)
	{
	   res.status(500).json({ erro: 'BAK-END',  message: err.message });
	}
})


router.post("link/",async function(req, res) {
try 
	{
	   const {id_empresa,id_evento,id_userlink,datalink } = req.body;

	   userlink  = await usuarioService.getUsuario(id_empresa,id_userlink);

	   if (!user) {
		  return res.status(403).send('Usuário do link inválido!');
	   }

       const eventoToken = tokenService.createTokenByDate(id_empresa, id_evento, id_userlink, datalink);

		await tokenService.insertToken({
				id_empresa: user.id_empresa,
				token: accessToken,
				tipo: 'E',
				validade: new Date(datalink), 
				id_usuario: user.id,
				status: 1,
				user_insert: user.id,
				user_update: 0
		});

		res.status(200).json({"id_empresa":user.id_empresa,"id_usuario": user.id, "razao":user.razao,"eventoToken": eventoToken});

	}
catch (err)
	{
	   res.status(500).json({ erro: 'BAK-END',  message: err.message });
	}
})
module.exports = router;
