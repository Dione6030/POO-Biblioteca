import { LivrosDAO } from "../interface/LivrosDAO";
import { API } from "../servidor/API";

export interface LivroDTO {
    _idLivro: number;
    _titulo: string;
    _autor: string;
    _ISBN: string;
    _anoPublicacao: Date;
}

export class Livro implements LivrosDAO {
    private _idLivro: number;
    private _titulo: string;
    private _autor: string;
    private _ISBN: string;
    private _anoPublicacao: Date;
    constructor(idLivro: number, titulo: string, autor: string, ISBN: string, anoPublicacao: Date) {
        this._idLivro = idLivro;
        this._titulo = titulo;
        this._autor = autor;
        this._ISBN = ISBN;
        this._anoPublicacao = anoPublicacao;
    }

    static daInterface(dto: LivroDTO): Livro {
        return new Livro(dto._idLivro, dto._titulo, dto._autor, dto._ISBN, dto._anoPublicacao);
    }

    get idLivro(): number {
        return this._idLivro;
    }

    get titulo(): string {
        return this._titulo;
    }
    set titulo(titulo: string) {
        if (titulo.trim() === "") throw new Error("O título não pode ser vazio.");
        if (titulo.length > 40) throw new Error("O título não pode ter mais de 40 caracteres.");
        this._titulo = titulo;
    }

    get autor(): string {
        return this._autor;
    }
    set autor(autor: string) {
        if (autor.trim() === "") throw new Error("O autor não pode ser vazio.");
        if (autor.length < 3 || autor.length > 40) throw new Error("O autor deve ter entre 3 e 40 caracteres.");
        this._autor = autor;
    }

    get ISBN(): string {
        return this._ISBN;
    }
    set ISBN(ISBN: string) {
        if (ISBN.trim() === "") throw new Error("O ISBN não pode ser vazio.");
        if (ISBN.length !== 13) throw new Error("O ISBN deve ter exatamente 13 caracteres.");
        this._ISBN = ISBN;
    }

    get anoPublicacao(): Date {
        return this._anoPublicacao;
    }
    set anoPublicacao(anoPublicacao: Date) {
        if (anoPublicacao > new Date()) throw new Error("O ano de publicação não pode ser no futuro.");
        this._anoPublicacao = anoPublicacao;
    }

    public async adicionar(livro: Livro): Promise<Livro> {
        const dto: LivroDTO = {
            _idLivro: livro.idLivro,
            _titulo: livro.titulo,
            _autor: livro.autor,
            _ISBN: livro.ISBN,
            _anoPublicacao: livro.anoPublicacao
        }
        const criado = await API.adicionarLivro(dto);
        return Livro.daInterface(criado);
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