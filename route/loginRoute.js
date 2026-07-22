/* ROUTE credenciais */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const usuarioService = require("../service/usuarioService");
const usuarioComplementarService = require("../service/complementar/usuarioService");
const tokenService = require("../service/tokenService");
const funcoes = require("../email/funcoes");
const shared = require("../util/shared.js");

/* Login */
router.post("/", async function(req, res) {
    try {
        const { id_empresa, codigo, password } = req.body;

        user = await usuarioService.getUsuario(id_empresa, codigo);


        if (!user) {
            
            return res.status(403).send("Credenciais inválidas");

        }
        
        if (!user || !bcrypt.compareSync(password, user.senha)) {
            
            return res.status(401).send("Credenciais inválidas");
        }

         console.log(password, user.senha);
        
        await tokenService.deleteTokenByUser(user.id_empresa, user.id);

        const accessToken = tokenService.generateAccessToken(user);

        const refreshToken = tokenService.generateRefreshToken(user);

        await tokenService.insertToken({
            id_empresa: user.id_empresa,
            token: accessToken,
            tipo: "A",
            validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            id_usuario: user.id,
            status: 1,
            user_insert: user.id,
            user_update: 0,
        });

        await tokenService.insertToken({
            id_empresa: user.id_empresa,
            token: refreshToken,
            tipo: "R",
            validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            id_usuario: user.id,
            status: 1,
            user_insert: user.id,
            user_update: 0,
        });

        res.status(200).json({
            id_empresa: user.id_empresa,
            id: user.id,
            razao: user.razao,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(500).json({ erro: "BAK-END", message: err.message });
    }
});

router.post("/loginbycpf", async function(req, res) {
    try {
        const { id_empresa, cnpj_cpf, password } = req.body;

        const cpf = shared.limparCnpj_Cpf(cnpj_cpf);

        user = await usuarioComplementarService.getUsuarioByCpf(id_empresa, cpf);

        console.log("User:", user);

        if (!user) {
            
            return res.status(403).send("Credenciais inválidas");

        }

        console.log(password, user.senha);
        
        if (!user || !bcrypt.compareSync(password, user.senha)) {

            console.log("Senha inválida");
            
            return res.status(401).send("Credenciais inválidas");
        }

         console.log(password, user.senha);
        
        await tokenService.deleteTokenByUser(user.id_empresa, user.id);

        const accessToken = tokenService.generateAccessToken(user);

        const refreshToken = tokenService.generateRefreshToken(user);

        await tokenService.insertToken({
            id_empresa: user.id_empresa,
            token: accessToken,
            tipo: "A",
            validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            id_usuario: user.id,
            status: 1,
            user_insert: user.id,
            user_update: 0,
        });

        await tokenService.insertToken({
            id_empresa: user.id_empresa,
            token: refreshToken,
            tipo: "R",
            validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            id_usuario: user.id,
            status: 1,
            user_insert: user.id,
            user_update: 0,
        });

        res.status(200).json({
            id_empresa: user.id_empresa,
            id: user.id,
            razao: user.razao,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(500).json({ erro: "BAK-END", message: err.message });
    }
});


router.post("refresh/", async function(req, res) {
    try {
        const { codigo, password } = req.body;

        user = await usuarioService.getUsuario(1, codigo);

        if (!user) {
            return res.status(403).send("Credenciais inválidas");
        }

        if (!user || !bcrypt.compareSync(password, user.senha)) {
            return res.status(401).send("Credenciais inválidas");
        }

        await tokenService.deleteTokenByUser(user.id_empresa, user.id);

        const accessToken = tokenService.generateAccessToken(user);

        const refreshToken = tokenService.generateRefreshToken(user);

        await tokenService.insertToken({
            id_empresa: user.id_empresa,
            token: accessToken,
            tipo: "A",
            validade: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
            id_usuario: user.id,
            status: 1,
            user_insert: user.id,
            user_update: 0,
        });

        await tokenService.insertToken({
            id_empresa: user.id_empresa,
            token: refreshToken,
            tipo: "R",
            validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            id_usuario: user.id,
            status: 1,
            user_insert: user.id,
            user_update: 0,
        });

        res.status(200).json({
            id_empresa: user.id_empresa,
            id_usuario: user.id,
            razao: user.razao,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(500).json({ erro: "BAK-END", message: err.message });
    }
});

router.post("link/", async function(req, res) {
    try {
        const { id_empresa, id_evento, id_userlink, datalink } = req.body;

        userlink = await usuarioService.getUsuario(id_empresa, id_userlink);

        if (!user) {
            return res.status(403).send("Usuário do link inválido!");
        }

        const eventoToken = tokenService.createTokenByDate(
            id_empresa,
            id_evento,
            id_userlink,
            datalink,
        );

        await tokenService.insertToken({
            id_empresa: user.id_empresa,
            token: accessToken,
            tipo: "E",
            validade: new Date(datalink),
            id_usuario: user.id,
            status: 1,
            user_insert: user.id,
            user_update: 0,
        });

        res.status(200).json({
            id_empresa: user.id_empresa,
            id_usuario: user.id,
            razao: user.razao,
            eventoToken: eventoToken,
        });
    } catch (err) {
        res.status(500).json({ erro: "BAK-END", message: err.message });
    }
});

router.post("/refreshpassword", async function (req, res) {
  try {
    /*
                        {
    
                        "id_empresa" : 1,
                        "id_usuario": 16,
                        }
                        */

    const { id_empresa, id_usuario } = req.body;

    const senhaNova = "mudarsenha";

    user = await usuarioService.getUsuario(id_empresa, id_usuario);

    if (!user) {
      return res
        .status(403)
        .send("Credenciais Inválidas - Usuário Não Encontrado!");
    }

    const hashedPassword = await bcrypt.hash(senhaNova, 10);

    const registro = await usuarioService.updatesenhaUsuario(
      id_empresa,
      id_usuario,
      hashedPassword,
      "S",
    );

    if (registro == null) {
      res.status(409).json({ message: "Falha ao Atualizar Senha!" });
    } else {
      await funcoes.preparaEmailNovaSenha(registro.id_empresa,registro.id);
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Usuario", message: err.message });
    }
  }
});

router.post("/redefinepassword", async function (req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token não informado" });
    }

    // 1. Validar token
    let payload;
    try {
      payload = await tokenService.verifyToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }
    // 2. Extrair dados do token
    const { id_empresa, id_usuario } = payload;

    if (!id_empresa || !id_usuario) {
      return res
        .status(400)
        .json({ message: "Token inválido: dados incompletos" });
    }

    // 3. Nova senha
    const senhaNova = "mudarsenha";

    // 4. Buscar usuário
    const user = await usuarioService.getUsuario(id_empresa, id_usuario);

    if (!user) {
      return res.status(403).json({ message: "Usuário não encontrado" });
    }

    // 5. Criptografar nova senha
    const hashedPassword = await bcrypt.hash(senhaNova, 10);

    // 6. Atualizar senha
    const registro = await usuarioService.updatesenhaUsuario(
      id_empresa,
      id_usuario,
      hashedPassword,
      "S",
    );

    if (!registro) {
      return res.status(409).json({ message: "Falha ao atualizar senha" });
    }

    // 7. Sucesso
    return res.status(200).json({
      message: "Senha redefinida com sucesso",
      usuario: registro,
    });
  } catch (err) {
    console.log(err);
    if (err.name === "MyExceptionDB") {
      return res.status(409).json(err);
    }

    return res.status(500).json({
      erro: "BACK-END",
      tabela: "Usuario",
      message: err.message,
    });
  }
});

router.post("/esqueceusenha", async function (req, res) {
  try {
    /*
                        {
                            "id_empresa":1,
                            "id_usuario": 16,
                        }
                        */

    const { id_empresa, id_usuario } = req.body;

    console.log("params", id_empresa, id_usuario);

    const senhaNova = "mudarsenha";

    user = await usuarioService.getUsuario(id_empresa, id_usuario);

    if (!user) {
      return res.status(403).send("Credenciais Inválidas !");
    }

    await funcoes.preparaEmailNovaSenha(id_empresa, id_usuario);

    res.status(200).json({ message: "E-Mail Foi Enviado!" });
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Usuario", message: err.message });
    }
  }
});


router.post("/esqueceusenhacpf", async function (req, res) {
  try {
    /*
                        {
                            "id_empresa":1,
                            "cpf": 025.000.000,
                        }
                        */

    const { id_empresa, cpf } = req.body;

    console.log("params", id_empresa, cpf);

    const senhaNova = "mudarsenha";

    user = await usuarioComplementarService.getUsuarioByCpf(id_empresa, cpf);

    if (!user) {
      return res.status(403).send("Credenciais Inválidas !");
    }

    await funcoes.preparaEmailNovaSenha(user.id_empresa, user.id);

    res.status(200).json({ message: "E-Mail Foi Enviado!" });
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Usuario", message: err.message });
    }
  }
});



module.exports = router;