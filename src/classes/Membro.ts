import { Pessoa } from "./Pessoa";
import { API } from "../servidor/API";

export interface MembroDTO {
    idPessoa: number;
    nome: string;
    numeroMatricula: string;
    endereco: string;
    telefone: string;
}

export class Membro extends Pessoa {
    constructor(idPessoa: number, nome: string, numeroMatricula: string, endereco: string, telefone: string) {
        super(idPessoa, nome, numeroMatricula, endereco, telefone);
    }

    public static daInterface(dto: MembroDTO): Membro {
        return new Membro(dto.idPessoa, dto.nome, dto.numeroMatricula, dto.endereco, dto.telefone);
    }

    get idPessoa(): number { return this._idPessoa; }

    get nome(): string { return this._nome; }
    set nome(nome: string) {
        if (nome.trim() === "") throw new Error("Você deve colocar o nome completo");
        if (nome.length < 3 || nome.length > 40) throw new Error("Nome deve ter entre 3 e 40 caracteres");
        this._nome = nome;
    }
    
    get numeroMatricula(): string { return this._numeroMatricula; }
    set numeroMatricula(numero: string) {
        if (numero.trim() === "") throw new Error("Você deve colocar o número de matrícula");
        this._numeroMatricula = numero;
    }

    get endereco(): string { return this._endereco; }
    set endereco(endereco: string) {
        if (endereco.trim() === "") throw new Error("Você deve colocar o endereço");
        this._endereco = endereco;
    }

    get telefone(): string { return this._telefone; }
    set telefone(telefone: string) {
        if (telefone.trim() === "") throw new Error("Você deve colocar o telefone");
        this._telefone = telefone;
    }

    public async adicionar(pessoa: Pessoa): Promise<Pessoa> {
        const dto: MembroDTO = {
            idPessoa: pessoa.idPessoa,
            nome: pessoa.nome,
            numeroMatricula: pessoa.numeroMatricula,
            endereco: pessoa.endereco,
            telefone: pessoa.telefone
        };
        const criado = await API.adicionarMembro(dto);
        return Membro.daInterface(criado);
    }

    public async atualizar(pessoa: Pessoa): Promise<Pessoa> {
        const dto: Partial<MembroDTO> = {
            nome: pessoa.nome,
            numeroMatricula: pessoa.numeroMatricula,
            endereco: pessoa.endereco,
            telefone: pessoa.telefone
        };
        const atualizado = await API.atualizarMembro(pessoa.idPessoa, dto);
        return Membro.daInterface(atualizado);
    }

    public async remover(idPessoa: number): Promise<Pessoa> {
        const existente = await API.buscarMembroPorId(idPessoa);
        await API.removerMembro(idPessoa);
        return Membro.daInterface(existente);
    }

    public async listar(): Promise<Pessoa[]> {
        const lista = await API.buscarMembros();
        return lista.map((m: any) => Membro.daInterface(m));
    }

    public static async listarTodos(): Promise<Membro[]> {
        const lista = await API.buscarMembros();
        return lista.map((m: any) => Membro.daInterface(m));
    }

    public static async obterPorId(idPessoa: number): Promise<Membro> {
        const encontrado = await API.buscarMembroPorId(idPessoa);
        return Membro.daInterface(encontrado);
    }
}