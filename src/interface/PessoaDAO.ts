import { Pessoa } from "../classes/Pessoa";

export interface PessoaDAO {
    adicionar(pessoa: Pessoa): Pessoa;
    remover(idPessoa: number): Pessoa;
    listar(): Pessoa[];
    atualizar(pessoa: Pessoa): Pessoa;
}