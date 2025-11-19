import { Livro } from "../classes/Livro";

export interface LivrosDAO {
    adicionar(livro: Livro): Promise<Livro>;
    atualizar(livro: Livro): Promise<Livro>;
    remover(idLivro: number): Promise<Livro>;
    listar(): Promise<Livro[]>;
}