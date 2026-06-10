const eventoSrv = require("../service/eventoService");
const usuarioSrv = require("../service/usuarioService");
const tokenSrv = require("../service/tokenService");

const fs = require("fs");
const path = require("path");
const resend = require("../email/email");

function htmlEventoLiberacao(evento) {
    return `
<div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
  <div style="max-width:700px; margin:auto; background:white; border-radius:8px; 
              border:1px solid #d9d9d9; padding:20px;">

    <h2 style="margin:0 0 20px 0; color:#1a73e8; text-align:center; 
               font-weight:600; border-bottom:2px solid #1a73e8; padding-bottom:10px;">
      Detalhes da Atividade
    </h2>

    <table width="100%" cellpadding="8" cellspacing="0" 
           style="font-size:14px; border-collapse:collapse;">

      <tr style="background:#eef3fb;">
        <td width="50%" style="border:1px solid #ddd;">
          <strong>Código:</strong><br>${evento.id}
        </td>
        <td width="50%" style="border:1px solid #ddd;">
          <strong>Situação:</strong><br>Aguardando Liberação
        </td>
      </tr>

      <tr>
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Responsável:</strong><br>${evento.usuario_razao}
        </td>
      </tr>

      <tr style="background:#eef3fb;">
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Descrição:</strong><br>${evento.descricao}
        </td>
      </tr>

      <tr>
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Rua:</strong><br>${evento.rua || ""}
        </td>
      </tr>

      <tr style="background:#eef3fb;">
        <td style="border:1px solid #ddd;">
          <strong>Número:</strong><br>${evento.nro || ""}
        </td>
        <td style="border:1px solid #ddd;">
          <strong>Bairro:</strong><br>${evento.bairro || ""}
        </td>
      </tr>

      <tr>
        <td style="border:1px solid #ddd;">
          <strong>Cidade:</strong><br>${evento.cidade || ""}
        </td>
        <td style="border:1px solid #ddd;">
          <strong>Estado:</strong><br>${evento.uf || ""}
        </td>
      </tr>

      <tr style="background:#eef3fb;">
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Complemento:</strong><br>${evento.complemento || ""}
        </td>
      </tr>

      <tr>
        <td style="border:1px solid #ddd;">
          <strong>CEP:</strong><br>${evento.cep || ""}
        </td>
        <td style="border:1px solid #ddd;">&nbsp;</td>
      </tr>

      <tr style="background:#eef3fb;">
        <td style="border:1px solid #ddd;">
          <strong>Data Inicial:</strong><br>${evento.inicio}
        </td>
        <td style="border:1px solid #ddd;">
          <strong>Data Final:</strong><br>${evento.final}
        </td>
      </tr>

      <tr>
        <td colspan="2" style="border:1px solid #ddd;">
          <strong>Observação:</strong><br>${evento.obs || ""}
        </td>
      </tr>

    </table>

  </div>
</div>
  `;
}

function htmlEventoLiberacaoEx01(evento, url) {
    return ` <!DOCTYPE html>
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
      
    </div>

    <h1>Liberação de Evento</h1>

    <p>Segue abaixo o resumo do evento para liberação:</p>

    ${htmlEventoLiberacao(evento)}
    
    <div class="button-area">
      <a class="btn btn-aprovar" href="${url}">
        APROVAR EVENTO
      </a>
   
    </div>

    <div class="footer">
      Este e-mail foi gerado automaticamente pelo sistema de eventos.<br>
      Por favor, não responda diretamente a esta mensagem.
    </div>

  </div>
</body>
</html>`;
}

exports.htmlEventoLiberacaoEx02 = function(
    codigo,
    descricao,
    cidade,
    estado,
    responsavel,
    dataInicial,
    dataFinal,
    observacoes,
    destinatario,
) {
    return ` <!DOCTYPE html>
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
</html>`;
};

exports.htmlEventoLiberacaoEx03 = function(
    codigo,
    descricao,
    cidade,
    estado,
    responsavel,
    dataInicial,
    dataFinal,
    observacoes,
    destinatario,
) {
    return `<!DOCTYPE html>
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
</html>`;
};

async function enviarEmailLiberacaoEvento(evento, usuario, token) {
    // Caminho do logo no seu projeto
    //const caminhoLogo = path.join(__dirname, "../tkx_backend/logo/logo-tkx.jpg");

    // Converte o logo para base64
    //const logoBase64 = fs.readFileSync(caminhoLogo, { encoding: "base64" });

    // Monta o HTML com o logo embutido

     const destinatario = usuario.email;

     console.log("Destinatário do email de liberação:", destinatario);

  let url = "";

  if (process.env.APP_URL) {
    url = process.env.APP_URL.concat(`liberaevento?token=${token}&id_evento=${evento.id}`);
    console.log("URL", url);
  } else {
    url = fs.readFileSync("./app_url.txt", "utf8");
    url = url.concat(`liberaevento?token=${token}&id_evento=${evento.id}`);
    console.log("URL - Arquivo", url);
  }

    const htmlAprovacao = htmlEventoLiberacaoEx01(evento,url);

    try {
        const resposta = await resend.emails.send({
            from: "Sistema <notificacoes@falconi-iot.com.br>",
            to: destinatario,
            subject: `Liberação do Evento - ${evento.descricao}`,
            html: htmlAprovacao,
        });

        console.log("Email enviado:", resposta);
        return resposta;
    } catch (erro) {
        console.error("Erro ao enviar email:", erro);
        throw erro;
    }
}

exports.preparaEmailLiberacao = async function(id_empresa, id_evento) {
    const evento = await eventoSrv.getEvento(id_empresa, id_evento);

    const par = {
        id_empresa: id_empresa,
        id: 999,
        razao: "",
        cnpj_cpf: "",
        grupo: 0,
        pagina: 0,
        tamPagina: 50,
        contador: "N",
        orderby: "",
        sharp: false,
    };

    const usuario = await usuarioSrv.getUsuarios(par);

    console.log("usuario email", usuario[0]);

    const token = tokenSrv.generateTempoToken(usuario[0]);

    await enviarEmailLiberacaoEvento(evento, usuario[0], token);
};