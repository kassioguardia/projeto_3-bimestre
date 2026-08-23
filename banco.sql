-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23/08/2026 às 04:41
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `hoffmannlab3d`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nome` varchar(130) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT current_timestamp(),
  `endereco` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `peca3d`
--

CREATE TABLE `peca3d` (
  `id` int(11) NOT NULL,
  `tamanho` bigint(20) DEFAULT NULL,
  `modelo` varchar(80) NOT NULL,
  `descricao` varchar(150) DEFAULT NULL,
  `tempoImpressao` time DEFAULT NULL,
  `peso` float(4,2) DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `id_subcategoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Acionadores `peca3d`
--
DELIMITER $$
CREATE TRIGGER `before_update_peca3d` BEFORE UPDATE ON `peca3d` FOR EACH ROW BEGIN
    SET NEW.tamanho = ABS(NEW.tamanho);
    SET NEW.peso = ABS(NEW.peso);
    SET NEW.preco = ABS(NEW.preco);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `peca_cliente`
--

CREATE TABLE `peca_cliente` (
  `id` int(11) NOT NULL,
  `id_peca3d` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `data_solicitacao` datetime DEFAULT current_timestamp(),
  `observacao` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `subcategoria`
--

CREATE TABLE `subcategoria` (
  `id` int(11) NOT NULL,
  `nome` varchar(130) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_relatorio_vendas_cliente`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_relatorio_vendas_cliente` (
`id_cliente` int(11)
,`cliente` varchar(150)
,`total_vendas` bigint(21)
,`valor_total` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Estrutura para view `vw_relatorio_vendas_cliente`
--
DROP TABLE IF EXISTS `vw_relatorio_vendas_cliente`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_relatorio_vendas_cliente`  AS SELECT `c`.`id` AS `id_cliente`, `c`.`nome` AS `cliente`, count(`pc`.`id`) AS `total_vendas`, sum(`p`.`preco`) AS `valor_total` FROM ((`cliente` `c` join `peca_cliente` `pc` on(`pc`.`id_cliente` = `c`.`id`)) join `peca3d` `p` on(`p`.`id` = `pc`.`id_peca3d`)) WHERE `pc`.`status` = 'Concluído' GROUP BY `c`.`id`, `c`.`nome` ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `peca3d`
--
ALTER TABLE `peca3d`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_peca_subcategoria` (`id_subcategoria`);

--
-- Índices de tabela `peca_cliente`
--
ALTER TABLE `peca_cliente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_peca_cliente_peca` (`id_peca3d`),
  ADD KEY `fk_peca_cliente_cliente` (`id_cliente`);

--
-- Índices de tabela `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_subcategoria_categoria` (`id_categoria`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `peca3d`
--
ALTER TABLE `peca3d`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `peca_cliente`
--
ALTER TABLE `peca_cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `subcategoria`
--
ALTER TABLE `subcategoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `peca3d`
--
ALTER TABLE `peca3d`
  ADD CONSTRAINT `fk_peca_subcategoria` FOREIGN KEY (`id_subcategoria`) REFERENCES `subcategoria` (`id`);

--
-- Restrições para tabelas `peca_cliente`
--
ALTER TABLE `peca_cliente`
  ADD CONSTRAINT `fk_peca_cliente_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`),
  ADD CONSTRAINT `fk_peca_cliente_peca` FOREIGN KEY (`id_peca3d`) REFERENCES `peca3d` (`id`);

--
-- Restrições para tabelas `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD CONSTRAINT `fk_subcategoria_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
