<?php

require_once file_exists(__DIR__ . "/config.php") ? __DIR__ . "/config.php" : __DIR__ . "/../config.php";

header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER["REQUEST_METHOD"] ?? '';

switch ($metodo) {

    case "GET":

        $sql = "SELECT * FROM peca3d";

        $stmt = $pdo->query($sql);

        echo json_encode($stmt->fetchAll());

        break;


    case "POST":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "INSERT INTO peca3d
            (tamanho, modelo, descricao, tempoImpressao, peso, preco, quantidade, id_subcategoria)
                VALUES
            (:tamanho, :modelo, :descricao, :tempoImpressao, :peso, :preco, :quantidade, :id_subcategoria)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":tamanho" => $dados["tamanho"],
            ":modelo" => $dados["modelo"],
            ":descricao" => $dados["descricao"],
            ":tempoImpressao" => $dados["tempoImpressao"],
            ":peso" => $dados["peso"],
            ":preco" => $dados["preco"],
            ":quantidade" => $dados["quantidade"] ?? 0,
            ":id_subcategoria" => $dados["id_subcategoria"]
        ]);

        echo json_encode([
            "mensagem" => "Peça 3D cadastrada com sucesso"
        ]);

        break;


    case "PUT":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "UPDATE peca3d
                SET tamanho = :tamanho,
                    modelo = :modelo,
                    descricao = :descricao,
                    tempoImpressao = :tempoImpressao,
                    peso = :peso,
                    preco = :preco,
                    quantidade = :quantidade,
                    id_subcategoria = :id_subcategoria
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"],
            ":tamanho" => $dados["tamanho"],
            ":modelo" => $dados["modelo"],
            ":descricao" => $dados["descricao"],
            ":tempoImpressao" => $dados["tempoImpressao"],
            ":peso" => $dados["peso"],
            ":preco" => $dados["preco"],
            ":quantidade" => $dados["quantidade"] ?? 0,
            ":id_subcategoria" => $dados["id_subcategoria"]
        ]);

        echo json_encode([
            "mensagem" => "Peça 3D atualizada com sucesso"
        ]);

        break;


    case "DELETE":

        $dados = json_decode(file_get_contents("php://input"), true);

        $sql = "DELETE FROM peca3d WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":id" => $dados["id"]
        ]);

        echo json_encode([
            "mensagem" => "Peça 3D excluída com sucesso"
        ]);

        break;


    default:

        http_response_code(405);

        echo json_encode([
            "erro" => "Método não permitido"
        ]);

        break;
}
