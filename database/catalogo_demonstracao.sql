-- Catálogo fictício para validar a API localmente em MySQL 8.
-- A reimportação atualiza os seis registros de demonstração pelos seus IDs.
CREATE DATABASE IF NOT EXISTS unifecaf_flix
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE unifecaf_flix;

CREATE TABLE IF NOT EXISTS filme (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(200) NOT NULL,
  sinopse TEXT NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO filme (id, nome, sinopse)
VALUES
  (1, 'O Farol de Vidro',
    'Uma restauradora volta à ilha onde cresceu e encontra cartas escondidas na antiga lanterna.'),
  (2, 'Cartas para o Céu',
    'Um relojoeiro e sua neta recuperam um astrolábio para refazer a rota de uma expedição esquecida.'),
  (3, 'A Última Estação do Vale',
    'Quando o trem deixa de circular, moradores do vale ocupam a estação para preservar sua memória.'),
  (4, 'A Casa das Marés',
    'Uma bióloga registra as mudanças da costa e reencontra a família que cuida de sua casa de infância.'),
  (5, 'Depois da Primeira Chuva',
    'Uma cooperativa recupera um pomar comunitário durante uma temporada de seca.'),
  (6, 'Três Minutos de Silêncio',
    'Uma técnica de som grava o silêncio de uma cidade e descobre histórias guardadas em fitas antigas.')
AS amostra
ON DUPLICATE KEY UPDATE nome = amostra.nome, sinopse = amostra.sinopse;
