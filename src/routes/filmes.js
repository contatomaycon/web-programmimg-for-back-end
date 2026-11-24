import { Router } from 'express';
import { listar, buscarPorId, filtrar } from '../controllers/filmes.js';

export const rotasFilmes = Router();

rotasFilmes.get('/filme', listar);
rotasFilmes.get('/filme/:id', buscarPorId);
rotasFilmes.get('/filtro/filme', filtrar);
