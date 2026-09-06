<?php

require_once file_exists(__DIR__ . "/config.php") ? __DIR__ . "/config.php" : __DIR__ . "/../config.php";

header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER["REQUEST_METHOD"] ?? '';

switch ($metodo) {

    case "GET":

        $sql = "SELECT * FROM subcategoria";

        $stmt = $pdo->query($sql);

        echo json_encode($stmt->fetchAll());

        break;


    case "POST":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "INSERT INTO subcategoria
                (nome, id_categoria)
                VALUES
                (:nome, :id_categoria)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":nome" => $dados["nome"],
            ":id_categoria" => $dados["id_categoria"]
        ]);

        echo json_encode([
            "mensagem" => "Subcategoria cadastrada com sucesso"
        ]);

        break;


    case "PUT":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "UPDATE subcategoria
                SET nome = :nome,
                    id_categoria = :id_categoria
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"],
            ":nome" => $dados["nome"],
            ":id_categoria" => $dados["id_categoria"]
        ]);

        echo json_encode([
            "mensagem" => "Subcategoria atualizada com sucesso"
        ]);

        break;


    case "DELETE":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "DELETE FROM subcategoria WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"]
        ]);

        echo json_encode([
            "mensagem" => "Subcategoria excluída com sucesso"
        ]);

        break;


    default:

        http_response_code(405);

        echo json_encode([
            "erro" => "Método não permitido"
        ]);

        break;
}
