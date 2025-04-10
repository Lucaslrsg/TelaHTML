<?php
require_once '../Database.php';

try {
    $sql5 = 'SELECT contratos, formularios,pedidos,propostas, id_usuario, data_venda as dataVenda, leads_blip as leadsblip, data_instalacao as dataInstalacao, data_contrato as dataContrato, tipo_pagamento as tipoDePagamento, valor, chat FROM vendas';

    $stmtTudoVendas = $conn->query($sql5);
    $dadosTudoVendas = $stmtTudoVendas->fetchAll(PDO::FETCH_ASSOC);

    header('Content-type: application/json');
    echo json_encode([
        'dados' => $dadosTudoVendas
    ]);
} catch (\Throwable $e) {
    echo 'Erro ao buscar tabela vendas';
}
