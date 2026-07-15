const ExcelJS = require('exceljs');

async function gerarRelatorioParticipantes(dados, caminhoArquivo) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    // Cabeçalho + alinhamento padrão à esquerda
    worksheet.columns = [
        { header: 'evento', key: 'evento_descricao', width: 30, alignment: { horizontal: 'left' } },
        { header: 'inscricao', key: 'inscricao', width: 15, alignment: { horizontal: 'left' } },
        { header: 'nome', key: 'inscrito_nome', width: 30, alignment: { horizontal: 'left' } },
        { header: 'cnpj_cpf', key: 'inscrito_cpf', width: 20, alignment: { horizontal: 'left' } },
        { header: 'data_nasc', key: 'inscrito_dt_nascimento', width: 15, alignment: { horizontal: 'left' } },
        { header: 'sexo', key: 'inscrito_sexo', width: 10, alignment: { horizontal: 'left' } },
        { header: 'nro_peito', key: 'nro_peito', width: 12, alignment: { horizontal: 'left' } },
        { header: 'categoria', key: 'categoria_descricao', width: 20, alignment: { horizontal: 'left' } },
        { header: 'kit_rg', key: 'entre_rg', width: 15, alignment: { horizontal: 'left' } },
        { header: 'kit_nome', key: 'entre_nome', width: 25, alignment: { horizontal: 'left' } },
        { header: 'kit_tam_camisa', key: 'entre_tam_camisa', width: 15, alignment: { horizontal: 'left' } },
    ];

    // Inserir linhas
    dados.forEach(item => {
        worksheet.addRow({
            evento_descricao: item.evento_descricao,
            inscricao: item.inscricao,
            inscrito_nome: item.inscrito_nome,
            inscrito_cpf: item.inscrito_cpf,
            inscrito_dt_nascimento: item.inscrito_dt_nascimento,
            inscrito_sexo: item.inscrito_sexo,
            nro_peito: item.nro_peito,
            categoria_descricao: item.categoria_descricao,
            entre_rg: item.entre_rg,
            entre_nome: item.entre_nome,
            entre_tam_camisa: item.entre_tam_camisa
        });
    });

    // Estilizar cabeçalho
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
    });

    // 🔒 Congelar primeira linha
    worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
    ];

    // 🔍 Adicionar filtro automático
    worksheet.autoFilter = {
        from: 'A1',
        to: 'K1'
    };

    await workbook.xlsx.writeFile(caminhoArquivo);
    console.log(`Relatório gerado em: ${caminhoArquivo}`);
}



module.exports = {
    gerarRelatorioParticipantes
};