import { PessoaDAO } from "../interface/PessoaDAO";

export abstract class Pessoa implements PessoaDAO {
    constructor(
        protected _idPessoa: number,
        protected _nome: string,
        protected _numeroMatricula: string,
        protected _endereco: string,
        protected _telefone: string
    ) {}

    public abstract adicionar(pessoa: Pessoa): Pessoa;

    public abstract atualizar(pessoa: Pessoa): Pessoa;

    public abstract remover(idPessoa: number): Pessoa;

    public abstract listar(): Pessoa[];
}