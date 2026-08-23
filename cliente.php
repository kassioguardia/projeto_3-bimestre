<?php

require_once "config.php";

header("Content-Type: application/json");

$metodo = $_SERVER["REQUEST_METHOD"];

switch ($metodo) {

    case "GET":

        $sql = "SELECT * FROM cliente";

        $stmt = $pdo->query($sql);

        echo json_encode($stmt->fetchAll());

        break;


    case "POST":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "INSERT INTO cliente
                (nome, email, telefone, endereco)
                VALUES
                (:nome, :email, :telefone, :endereco)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":nome" => $dados["nome"],
            ":email" => $dados["email"],
            ":telefone" => $dados["telefone"],
            ":endereco" => $dados["endereco"]
        ]);

        echo json_encode([
            "mensagem" => "Cliente cadastrado com sucesso"
        ]);

        break;


    case "PUT":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "UPDATE cliente
                SET nome = :nome,
                    email = :email,
                    telefone = :telefone,
                    endereco = :endereco
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"],
            ":nome" => $dados["nome"],
            ":email" => $dados["email"],
            ":telefone" => $dados["telefone"],
            ":endereco" => $dados["endereco"]
        ]);

        echo json_encode([
            "mensagem" => "Cliente atualizado com sucesso"
        ]);

        break;


    case "DELETE":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "DELETE FROM cliente WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"]
        ]);

        echo json_encode([
            "mensagem" => "Cliente excluído com sucesso"
        ]);

        break;


    default:

        http_response_code(405);

        echo json_encode([
            "erro" => "Método não permitido"
        ]);

        break;
}