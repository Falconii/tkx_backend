/* ROUTE entregasv2 */
const db = require('../../infra/database');
const express = require('express');
const router = express.Router(); 
const { autenticarToken} = require('../../middleware/autenticartoken');
const entregav2Srv = require('../../service/entregav2Service');
const participanteV2Srv = require('../../service/participantev2Service');

router.use(autenticarToken);


/* ROTA INSERT entregav2 com participante */
router.post("/insertentregaparticipante",async function(req, res) {
try 
    {
        
           let novaEntrega = null;

           const parametros = {
              id_empresa: req.id_empresa,
              id_usuario: req.id_usuario,
              id_participante: req.body.id_participante,
              entregav2: req.body.entregav2
            };
      
            console.log("parametros", parametros);
      
            let participante = await participanteV2Srv.getParticipantev2(
              parametros.id_empresa,
              parametros.entregav2.id_evento,
              parametros.id_participante,
            );
      
            if (participante == null) {
              res
                .status(401)
                .json({ message: `Participante N ª ${parametros.id_participante} Não Existe!` });
              return;
            }

           
            const entrega = await entregav2Srv.getEntregav2(  parametros.id_empresa,
              parametros.entregav2.id_evento,
              parametros.entregav2.id);


            if (entrega == null)
            {

               novaEntrega = await entregav2Srv.insertEntregav2(parametros.entregav2);

               participante.id_entrega = novaEntrega.id;

               const  registro =  participanteV2Srv.updateParticipantev2(participante);          
            }
            else
            {
                 novaEntrega = await entregav2Srv.updateEntregav2(parametros.entregav2);
                
                 participante.id_entrega = novaEntrega.id;

                 const  registro =  participanteV2Srv.updateParticipantev2(participante);    

            }

            const novoParticipante = await participanteV2Srv.getParticipantev2(
              parametros.id_empresa,
               parametros.entregav2.id_evento,
              parametros.id_participante,
            );

            res.status(200).json({Entregav2: novaEntrega, Participantev2: novoParticipante});
            
}
catch (err)
    {
        if(err.name == 'MyExceptionDB')
        {
            res.status(409).json(err);
        }
        else
        {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Entregav2', message: err.message });
        }
    }
})

router.delete("/deleteentregaparticipante",async function(req, res) {
try 
    {
        
           let novaEntrega = null;

           const parametros = {
              id_empresa: req.id_empresa,
              id_usuario: req.id_usuario,
              id_participante: req.body.id_participante,
              entregav2: req.body.entregav2
            };
      
            console.log("parametros", parametros);
      
            let participante = await participanteV2Srv.getParticipantev2(
              parametros.id_empresa,
              parametros.entregav2.id_evento,
              parametros.id_participante,
            );
      
            if (participante == null) {
              res
                .status(401)
                .json({ message: `Participante N ª ${parametros.id_participante} Não Existe!` });
              return;
            }

           
            await entregav2Srv.deleteEntregav2(  parametros.id_empresa,
              parametros.entregav2.id_evento,
              parametros.entregav2.id);


            participante.id_entrega = 0;

            await participanteV2Srv.updateParticipantev2(participante);

            const novoParticipante = await participanteV2Srv.getParticipantev2(
              parametros.id_empresa,
               parametros.entregav2.id_evento,
              parametros.id_participante,
            );

            res.status(200).json({Entregav2: null, Participantev2: novoParticipante});
            
}
catch (err)
    {
        if(err.name == 'MyExceptionDB')
        {
            res.status(409).json(err);
        }
        else
        {
            res.status(500).json({ erro: 'BAK-END', tabela: 'Entregav2', message: err.message });
        }
    }
})


module.exports = router;
