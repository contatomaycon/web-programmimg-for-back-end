export function apresentarLista(res, filmes) {
  return res.status(200).json({ filmes });
}

export function apresentarFilme(res, filme) {
  return res.status(200).json({ filme });
}

export function apresentarErro(res, status, codigo, mensagem) {
  return res.status(status).json({ erro: { codigo, mensagem } });
}
