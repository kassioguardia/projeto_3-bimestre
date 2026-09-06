<?php

require_once file_exists(__DIR__ . "/config.php") ? __DIR__ . "/config.php" : __DIR__ . "/../config.php";

header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER["REQUEST_METHOD"] ?? '';

switch ($metodo) {

    case "GET":

        $sql = "SELECT * FROM peca_cliente";

        $stmt = $pdo->query($sql);

        echo json_encode($stmt->fetchAll());

        break;


    case "POST":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "INSERT INTO peca_cliente
                (id_peca3d, id_cliente, observacao, status)
                VALUES
                (:id_peca3d, :id_cliente, :observacao, :status)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id_peca3d" => $dados["id_peca3d"],
            ":id_cliente" => $dados["id_cliente"],
            ":observacao" => $dados["observacao"],
            ":status" => $dados["status"]
        ]);

        echo json_encode([
            "mensagem" => "Peça do cliente cadastrada com sucesso"
        ]);

        break;


    case "PUT":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "UPDATE peca_cliente
                SET id_peca3d = :id_peca3d,
                    id_cliente = :id_cliente,
                    observacao = :observacao,
                    status = :status
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"],
            ":id_peca3d" => $dados["id_peca3d"],
            ":id_cliente" => $dados["id_cliente"],
            ":observacao" => $dados["observacao"],
            ":status" => $dados["status"]
        ]);

        echo json_encode([
            "mensagem" => "Peça do cliente atualizada com sucesso"
        ]);

        break;


    case "DELETE":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "DELETE FROM peca_cliente WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"]
        ]);

        echo json_encode([
            "mensagem" => "Peça do cliente excluída com sucesso"
        ]);

        break;


    default:

        http_response_code(405);

        echo json_encode([
            "erro" => "Método não permitido"
        ]);

        break;
}
