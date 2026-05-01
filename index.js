const cors = require("cors");
const express = require("express");
const resend = require("./email/email");

const fs = require("fs");
const path = require("path");

const app = express();

async function enviarEmailLiberacaoEvento({
  codigo,
  descricao,
  cidade,
  estado,
  responsavel,
  dataInicial,
  dataFinal,
  observacoes,
  destinatario,
}) {
  // Caminho do logo no seu projeto
  const caminhoLogo = path.join(__dirname, "../tkx_backend/logo/logo-tkx.jpg");

  // Converte o logo para base64
  const logoBase64 = fs.readFileSync(caminhoLogo, { encoding: "base64" });

  // Monta o HTML com o logo embutido
  const htmlAprovacao = `
  <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Liberação de Evento</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 640px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      padding: 20px 24px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 180px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 16px;
      color: #333333;
    }
    .info-block {
      margin-bottom: 16px;
    }
    .label {
      font-weight: bold;
      color: #555555;
      display: inline-block;
      min-width: 140px;
    }
    .value {
      color: #222222;
    }
    .obs {
      margin-top: 12px;
      padding: 10px 12px;
      background-color: #f9f9f9;
      border-left: 3px solid #1976d2;
      font-size: 14px;
      white-space: pre-wrap;
    }
    .button-area {
      text-align: center;
      margin-top: 30px;
    }
    .btn {
      padding: 14px 26px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
      color: #ffffff !important;
      margin: 0 10px;
    }
    .btn-aprovar {
      background-color: #28a745;
    }
    .btn-negar {
      background-color: #dc3545;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="logo">
      <img src="data:image/jpeg;base64,${logoBase64}" alt="Logo TKX">
    </div>

    <h1>Liberação de Evento</h1>

    <p>Segue abaixo o resumo do evento para liberação:</p>

    <div class="info-block">
      <div><span class="label">Código do evento:</span> <span class="value">${codigo}</span></div>
      <div><span class="label">Descrição:</span> <span class="value">${descricao}</span></div>
      <div><span class="label">Cidade / Estado:</span> <span class="value">${cidade} / ${estado}</span></div>
      <div><span class="label">Responsável:</span> <span class="value">${responsavel}</span></div>
      <div><span class="label">Data inicial:</span> <span class="value">${dataInicial}</span></div>
      <div><span class="label">Data final:</span> <span class="value">${dataFinal}</span></div>
    </div>

    <div class="obs">
      <strong>Observações:</strong><br>
      ${observacoes || "Sem observações."}
    </div>

    <div class="button-area">
      <a class="btn btn-aprovar" href="https://seusistema.com/aprovar-evento/${codigo}">
        APROVAR EVENTO
      </a>

      <a class="btn btn-negar" href="https://seusistema.com/negar-evento/${codigo}">
        NEGAR EVENTO
      </a>
    </div>

    <div class="footer">
      Este e-mail foi gerado automaticamente pelo sistema de eventos.<br>
      Por favor, não responda diretamente a esta mensagem.
    </div>

  </div>
</body>
</html>
  `;

  const statusMensagem = "Evento Liberado";

  const htmlLiberado = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Status do Evento</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 640px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      padding: 20px 24px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 180px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 16px;
      color: #333333;
    }
    .info-block {
      margin-bottom: 16px;
    }
    .label {
      font-weight: bold;
      color: #555555;
      display: inline-block;
      min-width: 140px;
    }
    .value {
      color: #222222;
    }
    .obs {
      margin-top: 12px;
      padding: 10px 12px;
      background-color: #f9f9f9;
      border-left: 3px solid #1976d2;
      font-size: 14px;
      white-space: pre-wrap;
    }
    .status-area {
      text-align: center;
      margin-top: 30px;
      font-size: 20px;
      font-weight: bold;
      padding: 14px;
      border-radius: 6px;
      color: #ffffff;
      width: 60%;
      margin-left: auto;
      margin-right: auto;
    }
    .status-liberado {
      background-color: #28a745;
    }
    .status-recusado {
      background-color: #dc3545;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="logo">
      <img src="data:image/jpeg;base64,${logoBase64}" alt="Logo TKX">
    </div>

    <h1>Status do Evento</h1>

    <p>Segue abaixo o resumo do evento:</p>

    <div class="info-block">
      <div><span class="label">Código do evento:</span> <span class="value">${codigo}</span></div>
      <div><span class="label">Descrição:</span> <span class="value">${descricao}</span></div>
      <div><span class="label">Cidade / Estado:</span> <span class="value">${cidade} / ${estado}</span></div>
      <div><span class="label">Responsável:</span> <span class="value">${responsavel}</span></div>
      <div><span class="label">Data inicial:</span> <span class="value">${dataInicial}</span></div>
      <div><span class="label">Data final:</span> <span class="value">${dataFinal}</span></div>
    </div>

    <div class="obs">
      <strong>Observações:</strong><br>
      ${observacoes || "Sem observações."}
    </div>

    <!-- STATUS DO EVENTO -->
    <div class="status-area ${statusMensagem === "Evento Liberado" ? "status-liberado" : "status-recusado"}">
      ${statusMensagem}
    </div>

    <div class="footer">
      Este e-mail foi gerado automaticamente pelo sistema de eventos.<br>
      Por favor, não responda diretamente a esta mensagem.
    </div>

  </div>
</body>
</html>
`;

  try {
    const resposta = await resend.emails.send({
      from: "Sistema <notificacoes@falconi-iot.com.br>",
      to: destinatario,
      subject: `Liberação do Evento - ${codigo}`,
      html: htmlAprovacao,
    });

    console.log("Email enviado:", resposta);
    return resposta;
  } catch (erro) {
    console.error("Erro ao enviar email:", erro);
    throw erro;
  }
}

/*
  Atualizando Versão 
  */

const PORT = 3000;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
/*
const allowCors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // colocar os dominios permitidos | ex: 127.0.0.1:3000

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, X-Access-Token, X-Key"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS, PATCH"
    );

    res.header("Access-Control-Allow-Credentials", "false");

    next();
};

app.use(allowCors); 

app.options('/*', allowCors);
*/

app.use("/api/login", require("./route/loginRoute"));
app.use("/api/empresa", require("./route/empresaRoute"));
app.use("/api/usuario", require("./route/usuarioRoute"));
app.use("/api/grupousuario", require("./route/grupousuarioRoute"));
app.use("/api/evento", require("./route/eventoRoute"));
app.use(
  "/api/evento_complementar",
  require("./route/complementar/eventoRoute.js"),
);
app.use("/api/participante", require("./route/participanteRoute"));
app.use("/api/participantev2", require("./route/participantev2Route"));
app.use("/api/inscrito", require("./route/inscritoRoute"));
app.use("/api/categoria", require("./route/categoriaRoute"));
app.use("/api/entrega", require("./route/entregaRoute"));
app.use("/api/link", require("./route/linkRoute"));
app.use("/api/token", require("./route/tokenRoute"));
app.use("/api/importacao", require("./route/ImportacaoRoute.js"));
app.use("/api/cabplanilha", require("./route/cabplanilhaRoute.js"));
app.use("/api/detplanilha", require("./route/detPlanilhaRoute.js"));
app.use("/api/uploadfoto", require("./route/fotoRoute.js"));
app.use("/api/categoriacontador", require("./route/categoriacontadorRoute.js"));
app.use(
  "/api/categoria_complementar",
  require("./route/complementar/categoriaRoute"),
);
app.use("/api/trocaParticipante", require("./route/trocaparticipanteRoute.js"));

app.use("/api/parametro", require("./route/parametroRoute.js"));
app.use(
  "/api/parametro/complementar",
  require("./route/complementar/parametroRoute.js"),
);

app.listen(PORT, () => {
  console.log(`Servidor No Ar. Porta ${PORT}`);
});

async function start() {
  await enviarEmailLiberacaoEvento({
    codigo: "000010",
    descricao: "CORRIDA DA CIDADE DE BOITUVA",
    cidade: "Boituva",
    estado: "SP",
    responsavel: "Marcos Silva",
    dataInicial: "10/05/2026",
    dataFinal: "12/05/2026",
    observacoes: "Evento precisa de aprovação do ADM.",
    destinatario: "contato@ektosprojetos.com.br",
  });
}

//start();
