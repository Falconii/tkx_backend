exports.ParseCVS = function(padrao, linha, delimiter) {
    let retorno = [];
    let campo = ''
    let ct = 0;
    let emAnalise = false;
    let entreAspas = false;
    let delimitador = delimiter;
    let fechouAspas = false;
    if (linha.length == 0) {
        return retorno;
    }
    for (let x = 0; x < linha.length; x++) {
        if (linha.charAt(x) == '"' && !emAnalise) {
            entreAspas = true;
            delimitador = '';
            emAnalise = true;
            continue;
        }
        if (entreAspas && linha.charAt(x) == '"' && emAnalise) {
            if ((x < linha.length - 1) && linha.charAt(x + 1) == '"') {
                x++;
            } else {
                entreAspas = false;
                delimitador = delimiter;
                retorno.push(campo);
                campo = '';
                emAnalise = false;
                fechouAspas = true;
                continue;
            }
        }
        if (fechouAspas) {
            fechouAspas = false;
        } else {
            emAnalise = true;
        }
        if (linha.charAt(x) == delimitador && emAnalise) {
            retorno.push(campo);
            campo = '';
            emAnalise = false;
        }
        if (emAnalise) {
            campo += linha.charAt(x);
        }
    }
    if (emAnalise) {
        retorno.push(campo);
    }
    return retorno;
}