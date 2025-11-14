import { Pessoa } from "./Pessoa";

export class Membro extends Pessoa {
    constructor(idPessoa: number, nome: string, numeroMatricula: string, endereco: string, telefone: string) {
        super(idPessoa, nome, numeroMatricula, endereco, telefone);
    }
    get idPessoa() {
        return this._idPessoa;
    }
    set nome(nome: string) {
        if (nome.trim() === "" ) throw new Error("Você deve colocar o nome completo");
        if (nome.length < 3 || nome.length > 40) throw new Error("Nome deve ter entre 3 e 40 caracteres");
        this.nome = nome;
    }
    get nome(): string {
        return this.nome;
    }
    
    set numeroMatricula(numero: string) {
        if (numero.trim() === "") throw new Error("Você deve colocar o número de matrícula");
        this.numeroMatricula = numero;
    }
    get numeroMatricula(): string {
        return this.numeroMatricula;
    }

    set endereco(endereco: string) {
        if (endereco.trim() === "") throw new Error("Você deve colocar o endereço");
        this.endereco = endereco;
    }
    get endereco(): string {
        return this.endereco;
    }

    set telefone(telefone: string) {
        if (telefone.trim() === "") throw new Error("Você deve colocar o telefone");
        this.telefone = telefone;
    }
    get telefone(): string {
        return this.telefone;
    }

    public adicionar(pessoa: Pessoa): Pessoa {
        throw new Error("Método não implementado");
    }

    public atualizar(pessoa: Pessoa): Pessoa {
        throw new Error("Método não implementado");
    }

    public remover(idPessoa: number): Pessoa {
        throw new Error("Método não implementado");
    }

    public listar(): Pessoa[] {
        throw new Error("Método não implementado");
    }
}