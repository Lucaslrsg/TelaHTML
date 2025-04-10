<?php /*
require_once '../Database.php';
try {
    $sql = 'SELECT COUNT(formularios) as formularios FROM vendas WHERE formularios = 1';
    $stmt = $conn->query($sql);

    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-type: application/json');
    echo json_encode($dados);
} catch (\Throwable $th) {
    echo 'Erro ao buscar formularios';
}
*/