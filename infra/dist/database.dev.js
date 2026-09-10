"use strict";

var pgp = require("pg-promise")();

var fs = require("fs");

var dbConfig;

if (process.env.DATABASE_URL) {
  dbConfig = process.env.DATABASE_URL;
  console.log("Conexão Configurada Para Nuvem");
} else {
  var conexao = JSON.parse(fs.readFileSync("./conexoes_nuvem.json", "utf8"));
  dbConfig = conexao.database_url;
  console.log("Conexão configurada Para Nuvem!");
}

var db = pgp(dbConfig);
module.exports = db;