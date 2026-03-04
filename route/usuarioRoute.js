/* ROUTE usuarios */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../middleware/autenticartoken");
const bcrypt = require("bcryptjs");
const usuarioSrv = require("../service/usuarioService");

router.use(autenticarToken);
/* ROTA GETONE usuario */
router.get("/:id_empresa/:id", async function(req, res) {
    try {
        const lsLista = await usuarioSrv.getUsuario(
            req.params.id_empresa,
            req.params.id,
        );
        if (lsLista == null) {
            res.status(409).json({ message: "Usuario Não Encontrada." });
        } else {
            res.status(200).json(lsLista);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "usuario", message: err.message });
        }
    }
});
/* ROTA GETALL usuario */
router.get("/", async function(req, res) {
    try {
        const lsLista = await usuarioSrv.getUsuarios();
        if (lsLista.length == 0) {
            res
                .status(409)
                .json({ message: "Nehuma Informação Para Esta Consulta." });
        } else {
            res.status(200).json(lsLista);
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "usuario", message: err.message });
        }
    }
});
/* ROTA INSERT usuario */
router.post("/", async function(req, res) {
    try {
        const usuario = req.body;
        const registro = await usuarioSrv.insertUsuario(usuario);
        if (registro == null) {
            res.status(409).json({ message: "Usuario Cadastrado!" });
        } else {
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
/* ROTA UPDATE usuario */
router.put("/", async function(req, res) {
    try {
        const usuario = req.body;
        const registro = await usuarioSrv.updateUsuario(usuario);
        if (registro == null) {
            res.status(409).json({ message: "Usuario Alterado Com Sucesso!" });
        } else {
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
/* ROTA DELETE usuario */
router.delete("/:id_empresa/:id", async function(req, res) {
    try {
        await usuarioSrv.deleteUsuario(req.params.id_empresa, req.params.id);
        res.status(200).json({ message: "Usuario Excluído Com Sucesso!" });
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
/* ROTA CONSULTA POST usuarios */
router.post("/usuarios", async function(req, res) {
    /*
          	{
          		"id_empresa":0, 
          		"id":0, 
          		"razao":"", 
          		"cnpj_cpf":"", 
          		"grupo":0, 
          		"pagina":0, 
          		"tamPagina":50, 
          		"contador":"N", 
          		"orderby":"", 
          		"sharp":false 
          	}
          */
    try {
        const params = req.body;
        const lsRegistros = await usuarioSrv.getUsuarios(params);
        if (lsRegistros.length == 0) {
            res.status(409).json({ message: "Usuario Nenhum Registro Encontrado!" });
        } else {
            res.status(200).json(lsRegistros);
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

/* ROTA atualiza senha usuario */
router.post("/updatesenha", async function(req, res) {
    try {
        /*
                                                                {
                                                                	
                                                                	"senhaantiga" : "123456",
                                                                	"senhanova": "marcos@2026",	
                                                                	"senharepetida": "marcos@2026"
                                                                }
                                                                */

        const { senhaantiga, senhanova, senharepetida } = req.body;
        const id_empresa = req.id_empresa;
        const id_usuario = req.id_usuario;

        console.log("REQUISIÇÃO UPDATE SENHA USUARIO:", req.body);
        if (senhanova !== senharepetida) {
            throw new Error("Senha e Senha Repetida Não Conferem!");
            return;
        }

        user = await usuarioSrv.getUsuario(id_empresa, id_usuario);

        if (!user) {
            return res
                .status(403)
                .send("Credenciais inválidas - usuário não encontrado!");
        }

        if (!user || !bcrypt.compareSync(senhaantiga, user.senha)) {
            return res.status(401).send("Credenciais inválidas ||||||");
        }

        const hashedPassword = await bcrypt.hash(senhanova, 10);

        const registro = await usuarioSrv.updatesenhaUsuario(
            id_empresa,
            id_usuario,
            hashedPassword,
        );

        if (registro == null) {
            res.status(409).json({ message: "Falha ao Atualizar Senha!" });
        } else {
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

module.exports = router;