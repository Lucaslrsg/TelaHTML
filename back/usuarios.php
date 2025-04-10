<?php
require_once '../Database.php';

try {
    $sql = 'SELECT id, nome, email FROM usuarios';
    $stmt = $conn->query($sql);

    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-type: application/json');
    echo json_encode($dados);
} catch (\Throwable $e) {
    echo'Erro ao buscar a tabela usuarios';
}
