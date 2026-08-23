<?php

require_once "config.php";

header("Content-Type: application/json");

$metodo = $_SERVER["REQUEST_METHOD"];

if ($metodo === "GET") {
    try {
        $sql = "SELECT * FROM vw_relatorio_vendas_cliente";
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
