/* ROUTE parametros */
const db = require('../../infra/database');
const express = require('express');
const router = express.Router();
const parametroSrv = require('../../service/parametroService');
const { autenticarToken} = require('../../middleware/autenticartoken');

router.use(autenticarToken); 

/* ATUALIZA parametro */
router.post("/atualizarparametro", async function(req, res) {
    try {

        console.log(req.body);

        const parametro = req.body;

        const param = await parametroSrv.getParametro(parametro.id_empresa, parametro.modulo, parametro.assinatura, parametro.id_usuario);

        console.log('atualizarparametro seek', param);

        if (param == null) {
            console.log('Inseri', parametro);
            const registro = await parametroSrv.insertParametro(parametro);
            if (registro == null) {
                res.status(409).json({ message: 'Parametro Não Cadastrado!' });
            } else {
                res.status(200).json(registro);
            }
        } else {
            console.log('Alterei', parametro);
            const registro = await parametroSrv.updateParametro(parametro);
            if (registro == null) {
                res.status(409).json({ message: 'Parametro Alterado Com Sucesso!' });
            } else {
                res.status(200).json(registro);
            }
        }
    } catch (err) {
        if (err.name == 'MyExceptionDB') {
            res.status(409).json(err);
        } else {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Parametro', message: err.message });
        }
    }
})

module.exports = router;