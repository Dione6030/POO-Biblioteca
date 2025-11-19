import { EmprestimoDAO } from "../interface/EmprestimoDAO";
import { API } from "../servidor/API";


export class Emprestimo implements EmprestimoDAO {
    private _idEmprestimo: number;
    private _dataEmprestimo: Date;
    private _dataDevolução: Date;

    constructor(dataEmprestimo: Date, idEmprestimo: number) {
        this._dataEmprestimo = dataEmprestimo;
        this._dataDevolução = new Date(0);
        this._idEmprestimo = idEmprestimo;
    }

    get dataEmprestimo(): Date {
        return this._dataEmprestimo;
    }
    set dataEmprestimo(data: Date) {
        this._dataEmprestimo = data;
    }

    public get dataDevolução(): Date {
        return this._dataDevolução;
    }
    public set dataDevolução(data: Date) {
        if (data < this._dataEmprestimo) {
            throw new Error("A data de devolução não pode ser anterior à data de empréstimo.");
        }
        this._dataDevolução = data;
    }

    public get idEmprestimo(): number {
        return this._idEmprestimo;
    }


    public adicionar(emprestimo: Emprestimo): Emprestimo {
        throw new Error("Método não implementado");
    }

    public atualizar(emprestimo: Emprestimo): Emprestimo {
        throw new Error("Método não implementado");
    }

    public remover(idEmprestimo: number): Emprestimo {
        throw new Error("Método não implementado");
    }

    public listarAtivos(): Emprestimo[] {
        throw new Error("Método não implementado");
    }
    listarTodos(): Emprestimo[] {
        throw new Error("Método não implementado");
    }
}