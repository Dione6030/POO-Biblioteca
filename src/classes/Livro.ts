import { LivrosDAO } from "../interface/LivrosDAO";

export class Livro implements LivrosDAO {
    private _idLivro: number;
    private _titulo: string;
    private _autor: string;
    private _ISBN: string;
    private _anoPublicacao: Date;
    constructor(idLivro: number, titulo: string) {
        this._idLivro = idLivro;
        this._titulo = titulo;
        this._autor = "";
        this._ISBN = "";
        this._anoPublicacao = new Date(0);
    }

    adicionar(livro: Livro): Livro {
        throw new Error("Método não implementado");
    }

    atualizar(livro: Livro): Livro {
        throw new Error("Método não implementado");
    }

    
    remover(idLivro: number): Livro {
        throw new Error("Método não implementado");
    }

    listar(): Livro[] {
        throw new Error("Método não implementado");
    }
}