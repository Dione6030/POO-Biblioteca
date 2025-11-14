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

    get idLivro(): number {
        return this._idLivro;
    }

    get titulo(): string {
        return this._titulo;
    }
    get autor(): string {
        return this._autor;
    }
    get ISBN(): string {
        return this._ISBN;
    }
    get anoPublicacao(): Date {
        return this._anoPublicacao;
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