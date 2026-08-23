<?php

require_once "config.php";

header("Content-Type: application/json");

$metodo = $_SERVER["REQUEST_METHOD"];

switch ($metodo) {

    case "GET":

        $sql = "SELECT * FROM categoria";

        $stmt = $pdo->query($sql);

        echo json_encode($stmt->fetchAll());

        break;


    case "POST":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "INSERT INTO categoria
                (nome)
                VALUES
                (:nome)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":nome" => $dados["nome"]
        ]);

        echo json_encode([
            "mensagem" => "Categoria cadastrada com sucesso"
        ]);

        break;


    case "PUT":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "UPDATE categoria
                SET nome = :nome
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"],
            ":nome" => $dados["nome"]
        ]);

        echo json_encode([
            "mensagem" => "Categoria atualizada com sucesso"
        ]);

        break;


    case "DELETE":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "DELETE FROM categoria WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"]
        ]);

        echo json_encode([
            "mensagem" => "Categoria excluída com sucesso"
        ]);

        break;


    default:

        http_response_code(405);

        echo json_encode([
            "erro" => "Método não permitido"
        ]);

        break;
}
