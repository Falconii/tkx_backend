const cors = require("cors");
const express = require("express");
const app = express();

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
app.use("/api/participante", require("./route/participanteRoute"));
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

app.listen(PORT, () => {
  console.log(`Servidor No Ar. Porta ${PORT}`);
});
