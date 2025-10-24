const express = require('express');
const router = express.Router(); 
const {autenticarToken} = require('../middleware/autenticartoken');

router.use(autenticarToken);

