import * as model from '../models/filmes.js';
import * as view from '../views/filmes.js';

export async function listar(req, res) {
  const filmes = await model.listar();
  return view.apresentarLista(res, filmes);
}

export async function buscarPorId(req, res) {
  const idTexto = req.params.id;
  const id = Number(idTexto);

  if (!Number.isSafeInteger(id) || id <= 0 || String(id) !== idTexto) {
    return view.apresentarErro(
      res, 400, 'ID_INVALIDO', 'Informe um identificador inteiro positivo em formato decimal.',
    );
  }

  const filme = await model.buscarPorId(id);
  if (!filme) {
    return view.apresentarErro(res, 404, 'FILME_NAO_ENCONTRADO', 'Filme não encontrado.');
  }

  return view.apresentarFilme(res, filme);
}

export async function filtrar(req, res) {
  const { nome } = req.query;
  const termo = typeof nome === 'string' ? nome.trim() : '';

  if (!termo || [...termo].length > 120) {
    return view.apresentarErro(
      res, 400, 'NOME_INVALIDO', 'Informe o parâmetro nome uma única vez, com 1 a 120 caracteres.',
    );
  }

  const filmes = await model.filtrarPorNomeOuSinopse(termo);
  return view.apresentarLista(res, filmes);
}
