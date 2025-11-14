import { Emprestimo } from "../classes/Emprestimo";

export interface EmprestimoDAO {
    adicionar(emprestimo: Emprestimo): Emprestimo;
    atualizar(emprestimo: Emprestimo): Emprestimo;
    remover(idEmprestimo: number): Emprestimo;
    listarAtivos(): Emprestimo[];
    listarTodos(): Emprestimo[];
}