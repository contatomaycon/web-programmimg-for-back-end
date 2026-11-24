import express from 'express';
import { rotasFilmes } from './routes/filmes.js';
import { apresentarErro } from './views/filmes.js';

export const app = express();

app.disable('x-powered-by');
app.set('query parser', 'simple');

app.use('/v1/controle-filmes', rotasFilmes);

app.use((_req, res) => {
  return apresentarErro(res, 404, 'ROTA_NAO_ENCONTRADA', 'Rota não encontrada.');
});

app.use((erro, _req, res, next) => {
  if (res.headersSent) {
    return next(erro);
  }

  if (erro instanceof URIError && erro.status === 400) {
    return apresentarErro(res, 400, 'ENDERECO_INVALIDO', 'Endereço com codificação inválida.');
  }

  console.error('Falha ao processar a consulta.', erro.code ?? erro.name);
  return apresentarErro(res, 500, 'ERRO_INTERNO', 'Não foi possível concluir a consulta.');
});
