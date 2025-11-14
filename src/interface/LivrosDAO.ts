import { Livro } from "../classes/Livro";

export interface LivrosDAO {
    adicionar(livro: Livro): Livro;
    atualizar(livro: Livro): Livro;
    remover(idLivro: number): Livro;
    listar(): Livro[];
}