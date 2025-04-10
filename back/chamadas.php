<?php
require_once '../Database.php';
try {
    $sql = 'SELECT id, id_usuario as idUsuario, data_chamada as dataChamada, tempo_chamada as tempoChamada FROM closer_log';
    $stmt = $conn->query($sql); 
    
    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-type: application/json');
    echo json_encode($dados);
} catch (\Throwable $th) {
    echo('Erro ao consultar chamadas');
}