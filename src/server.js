import { once } from 'node:events';
import { app } from './app.js';
import { pool } from './config/database.js';
import { verificarEsquema } from './models/filmes.js';

const host = '127.0.0.1';
const porta = Number(process.env.PORT ?? 3000);

try {
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
    throw new Error('PORT deve ser um número inteiro entre 1 e 65535.');
  }

  await verificarEsquema();
  const servidor = app.listen(porta, host);
  await once(servidor, 'listening');
  console.log(`UniFECAF Flix disponível em http://${host}:${porta}`);

  let encerrando = false;

  async function encerrar() {
    if (encerrando) {
      return;
    }
    encerrando = true;

    try {
      await new Promise((resolve, reject) => {
        servidor.close((erro) => (erro ? reject(erro) : resolve()));
      });
    } finally {
      await pool.end();
    }
  }

  for (const sinal of ['SIGINT', 'SIGTERM']) {
    process.once(sinal, () => {
      encerrar().catch((erro) => {
        console.error('Falha ao encerrar a API.', erro.message);
        process.exitCode = 1;
      });
    });
  }
} catch (erro) {
  console.error('Não foi possível iniciar a API.', erro.message);
  await pool.end();
  process.exitCode = 1;
}
