<?php

require_once "config.php";

header("Content-Type: application/json");

$metodo = $_SERVER["REQUEST_METHOD"];

if ($metodo === "GET") {
    try {
        $sql = "SELECT c.id AS id_cliente,
                       c.nome AS cliente,
                       p.quantidade AS quantidade,
                       p.preco AS valor_unitario
                FROM cliente c
                INNER JOIN peca_cliente pc ON pc.id_cliente = c.id
                INNER JOIN peca3d p ON p.id = pc.id_peca3d
                WHERE pc.status = 'Concluído'";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll());
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["erro" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido"]);
}
