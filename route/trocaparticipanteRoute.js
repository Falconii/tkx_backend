/* ROUTE participantes */
const db = require('../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../middleware/autenticartoken');
const participanteSrv = require('../service/complementar/participanteService');
const shared = require('../util/shared');
router.use(autenticarToken); 

/* TROCA PARTICIPANTE */
router.post("/trocaparticipante",async function(req, res) {
try 
    {
        /*
         {
            "id_empresa" :      1,
            "id_evento"  :      1, 
            "new_inscrito"    : {},
            "participante"    : {}
        }
        */

        
        const params = req.body;

        //Gravar Novo Inscrito

        newInscrito = params.new_inscrito;

        if (newInscrito.id == 0) {

            newInscrito  = await shared._incluirInscrito(newInscrito);

            if (newInscrito == null) 
                {
                    res.status(409).json({ message: 'Falha Na Inclusão Do Inscrito' });
                    return;
                }
        }

        const participantAlterado = await participanteSrv.trocaParticipante(params.participante,newInscrito.id);

        res.status(200).json({participantAlterado : participantAlterado});
    }
catch (err)
    {
        if(err.name == 'MyExceptionDB')
        {
            res.status(409).json(err);
        }
        else
        {
            res.status(500).json({ erro: 'BAK-END', tabela: 'participante', message: err.message });
        }
    }
})



module.exports = router;