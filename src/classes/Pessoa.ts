import { PessoaDAO } from "../interface/PessoaDAO";

export abstract class Pessoa implements PessoaDAO {
    constructor(
        protected _idPessoa: number,
        protected _nome: string,
        protected _numeroMatricula: string,
        protected _endereco: string,
        protected _telefone: string
    ) {}

    public abstract adicionar(pessoa: Pessoa): Promise<Pessoa>;

    public abstract atualizar(pessoa: Pessoa): Promise<Pessoa>;

    public abstract remover(idPessoa: number): Promise<Pessoa>;

    public abstract listar(): Promise<Pessoa[]>;

    public get idPessoa(): number { return this._idPessoa; }

    public get nome(): string { return this._nome; }

    public get numeroMatricula(): string { return this._numeroMatricula; }

    public get endereco(): string { return this._endereco; }

    public get telefone(): string { return this._telefone; }
    
}