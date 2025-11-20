import { LivrosDAO } from "../interface/LivrosDAO";
import { API } from "../servidor/API";

export interface LivroDTO {
    _idLivro?: number; idLivro?: number;
    _titulo?: string; titulo?: string;
    _autor?: string; autor?: string;
    _ISBN?: string; ISBN?: string;
    _anoPublicacao?: string | Date; anoPublicacao?: string | Date;
    id?: string;
}

export class Livro implements LivrosDAO {
    private _idLivro: number;
    private _titulo: string;
    private _autor: string;
    private _ISBN: string;
    private _anoPublicacao: Date;
    constructor(idLivro: number, titulo: string, autor: string, ISBN: string, anoPublicacao: Date) {
        this._idLivro = idLivro ?? 0;
        this._titulo = titulo ?? "";
        this._autor = autor ?? "";
        this._ISBN = ISBN ?? "";
        this._anoPublicacao = anoPublicacao instanceof Date ? anoPublicacao : new Date();
    }

    static daInterface(dto: LivroDTO): Livro {
        const idLivro = dto._idLivro ?? dto.idLivro ?? 0;
        const titulo = dto._titulo ?? dto.titulo ?? "";
        const autor = dto._autor ?? dto.autor ?? "";
        const ISBN = dto._ISBN ?? dto.ISBN ?? "";
        const anoRaw = dto._anoPublicacao ?? dto.anoPublicacao;
        let anoPublicacao: Date;
        if (anoRaw instanceof Date) {
            anoPublicacao = anoRaw;
        } else if (typeof anoRaw === "string" && anoRaw.trim().length > 0) {
            // Tenta parsear string ISO ou outros formatos
            const parsed = new Date(anoRaw);
            anoPublicacao = isNaN(parsed.getTime()) ? new Date() : parsed;
        } else {
            anoPublicacao = new Date();
        }
        return new Livro(idLivro, titulo, autor, ISBN, anoPublicacao);
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
        };
        const criado = await API.adicionarLivro(dto);
        return Livro.daInterface(criado);
    }

    public async atualizar(livro: Livro): Promise<Livro> {
        const dto: LivroDTO = {
            _idLivro: livro.idLivro,
            _titulo: livro.titulo,
            _autor: livro.autor,
            _ISBN: livro.ISBN,
            _anoPublicacao: livro.anoPublicacao
        };
        const atualizado = await API.atualizarLivro(livro.idLivro, dto);
        return Livro.daInterface(atualizado);
    }

    
    public async remover(idLivro: number): Promise<Livro> {
        const exite = await API.buscarLivroPorId(idLivro);
        if (!exite) throw new Error("Livro não encontrado para remoção.");
        await API.removerLivro(idLivro);
        return Livro.daInterface(exite);
    }

    public async listar(): Promise<Livro[]> {
        const listaDTO = await API.buscarLivros();
        return listaDTO.map((dto) => Livro.daInterface(dto));
    }

    public static async listarTodos(): Promise<Livro[]> {
        const listaDTO = await API.buscarLivros();
        return listaDTO.map((dto) => Livro.daInterface(dto));
    }

    public static async obterPorId(idLivro: number): Promise<Livro> {
        const dto = await API.buscarLivroPorId(idLivro);
        if (!dto) throw new Error("Livro não encontrado.");
        return Livro.daInterface(dto);
    }
}