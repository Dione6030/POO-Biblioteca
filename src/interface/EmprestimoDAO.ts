import { Emprestimo } from "../classes/Emprestimo";

export interface EmprestimoDAO {
    adicionar(emprestimo: Emprestimo): Promise<Emprestimo>;
    atualizar(emprestimo: Emprestimo): Promise<Emprestimo>;
    remover(idEmprestimo: number): Promise<Emprestimo>;
    listarAtivos(): Promise<Emprestimo[]>;
    listarTodos(): Promise<Emprestimo[]>;
}