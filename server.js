/* fontes gerado automaticamente */
const express = require('express');
const cors = require('cors');
const app = express(); app.use(express.json());
app.use(cors());
app.use("/api/empresa", require('./route/empresaRoute'));
app.use("/api/usuario", require('./route/usuarioRoute'));
app.use("/api/grupousuario", require('./route/grupousuarioRoute'));
app.use("/api/evento", require('./route/eventoRoute'));
app.use("/api/inscrito", require('./route/inscritoRoute'));
app.use("/api/categoria", require('./route/categoriaRoute'));
app.use("/api/entrega", require('./route/entregaRoute'));
app.use("/api/link", require('./route/linkRoute'));
app.use("/api/token", require('./route/tokenRoute'));
app.use("/api/participante", require('./route/participanteRoute'));
app.use((err, req, res, next) =>  { res.status(err.httpStatusCode).json({ error: err.message, merda: 'Deu Erro' }) });
app.listen(3000, () => { console.log('Servidor No Ar. Porta 3000'); });
