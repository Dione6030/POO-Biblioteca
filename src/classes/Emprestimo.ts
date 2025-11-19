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

    static fromDTO(dto: EmprestimoDTO): Emprestimo {
        const parseDate = (v: string | Date | null): Date | null => {
            if (v === null) return null;
            if (v instanceof Date) return v;
            // suporta 'YYYY-MM-DD' e 'DD/MM/YYYY'
            if (/^\d{4}-\d{2}-\d{2}/.test(v)) return new Date(v);
            const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
            if (m && m.length === 4) {
                const [, dia, mes, ano] = m as [string, string, string, string];
                return new Date(Number(ano), Number(mes) - 1, Number(dia));
            }
            const d = new Date(v);
            return isNaN(d.getTime()) ? null : d;
        };
        return new Emprestimo(
            dto.idEmprestimo,
            dto.idLivro,
            dto.idPessoa,
            parseDate(dto.dataEmprestimo) || new Date(),
            (dto.status as any) ?? 'ativo',
            parseDate(dto.dataDevolucao)
        );
    }

    toDTO(): EmprestimoDTO {
        const fmt = (d: Date | null): string | null => {
            if (!d) return null;
            const part = d.toISOString().split('T')[0] || null;
            return part;
        };
        return {
            idEmprestimo: this._idEmprestimo,
            idLivro: this._idLivro,
            idPessoa: this._idPessoa,
            dataEmprestimo: fmt(this._dataEmprestimo)!,
            dataDevolucao: fmt(this._dataDevolucao),
            status: this._status
        };
    }

    get idEmprestimo(): number { return this._idEmprestimo; }
    get idLivro(): number { return this._idLivro; }
    set idLivro(v: number) { this._idLivro = v; }
    get idPessoa(): number { return this._idPessoa; }
    set idPessoa(v: number) { this._idPessoa = v; }
    get dataEmprestimo(): Date { return this._dataEmprestimo; }
    set dataEmprestimo(d: Date) { this._dataEmprestimo = d; }
    get dataDevolucao(): Date | null { return this._dataDevolucao; }
    set dataDevolucao(d: Date | null) {
        if (d && d < this._dataEmprestimo) throw new Error('A devolução não pode ser anterior ao empréstimo');
        this._dataDevolucao = d;
    }
    get status(): string { return this._status; }
    set status(s: string) { this._status = s; }

    public async adicionar(emprestimo: Emprestimo): Promise<Emprestimo> {
        const criado = await API.adicionarEmprestimo(emprestimo.toDTO());
        return Emprestimo.fromDTO(criado);
    }

    public async atualizar(emprestimo: Emprestimo): Promise<Emprestimo> {
        const atualizado = await API.atualizarEmprestimo(emprestimo.idEmprestimo, emprestimo.toDTO());
        return Emprestimo.fromDTO(atualizado);
    }

    public remover(idEmprestimo: number): Emprestimo {
        throw new Error("Método não implementado");
    }

    public async listarAtivos(): Promise<Emprestimo[]> {
        const lista = await API.buscarEmprestimosPorStatus('ativo');
        return lista.map(Emprestimo.fromDTO);
    }

    public async listarTodos(): Promise<Emprestimo[]> {
        const lista = await API.buscarEmprestimos();
        return lista.map(Emprestimo.fromDTO);
    }

    public static async listar(): Promise<Emprestimo[]> {
        const lista = await API.buscarEmprestimos();
        return lista.map(Emprestimo.fromDTO);
    }

    public static async listarSomenteAtivos(): Promise<Emprestimo[]> {
        const lista = await API.buscarEmprestimosPorStatus('ativo');
        return lista.map(Emprestimo.fromDTO);
    }

    public static async obterPorId(idEmprestimo: number): Promise<Emprestimo> {
        const dto = await API.buscarEmprestimoPorId(idEmprestimo);
        return Emprestimo.fromDTO(dto);
    }
}