import { pool } from '../config/database.js';

const consultaFilmes = 'SELECT id, nome, sinopse FROM filme';

export async function verificarEsquema() {
  await pool.execute(`${consultaFilmes} LIMIT 0`);
}

export async function listar() {
  const [filmes] = await pool.execute(`${consultaFilmes} ORDER BY id`);
  return filmes;
}

export async function buscarPorId(id) {
  const [filmes] = await pool.execute(`${consultaFilmes} WHERE id = ?`, [id]);
  return filmes[0] ?? null;
}

export async function filtrarPorNomeOuSinopse(termo) {
  // Os curingas são fixados pela API. Símbolos do termo são comparados literalmente.
  const padrao = `%${termo.replace(/[!%_]/g, '!$&')}%`;
  const [filmes] = await pool.execute(
    `${consultaFilmes}
       WHERE CONVERT(nome USING utf8mb4) COLLATE utf8mb4_unicode_ci LIKE ? ESCAPE '!'
          OR CONVERT(sinopse USING utf8mb4) COLLATE utf8mb4_unicode_ci LIKE ? ESCAPE '!'
       ORDER BY id`,
    [padrao, padrao],
  );
  return filmes;
}
