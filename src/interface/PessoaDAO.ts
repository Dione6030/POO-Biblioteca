import { Pessoa } from "../classes/Pessoa";

export interface PessoaDAO {
    adicionar(pessoa: Pessoa): Promise<Pessoa>;
    remover(idPessoa: number): Promise<Pessoa>;
    listar(): Promise<Pessoa[]>;
    atualizar(pessoa: Pessoa): Promise<Pessoa>;
}