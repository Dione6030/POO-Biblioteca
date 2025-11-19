import { EmprestimoDAO } from "../interface/EmprestimoDAO";
import { API } from "../servidor/API";

export interface EmprestimoDTO {
    idEmprestimo: number;
    idLivro: number;
    idPessoa: number;
    dataEmprestimo: string | Date;
    dataDevolucao: string | Date | null;
    status: 'ativo' | 'devolvido' | string;
}

export class Emprestimo implements EmprestimoDAO {
    private _idEmprestimo: number;
    private _idLivro: number;
    private _idPessoa: number;
    private _dataEmprestimo: Date;
    private _dataDevolucao: Date | null;
    private _status: 'ativo' | 'devolvido' | string;

    constructor(
        idEmprestimo: number,
        idLivro: number,
        idPessoa: number,
        dataEmprestimo: Date,
        status: 'ativo' | 'devolvido' | string = 'ativo',
        dataDevolucao: Date | null = null
    ) {
        this._idEmprestimo = idEmprestimo;
        this._idLivro = idLivro;
        this._idPessoa = idPessoa;
        this._dataEmprestimo = dataEmprestimo;
        this._status = status;
        this._dataDevolucao = dataDevolucao;
    }

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