import { Membro } from '../src/classes/Membro';
import { describe, expect, jest, beforeEach, test } from "@jest/globals";

// Mock da API
jest.mock('../src/servidor/API', () => ({
  API: {
    adicionarMembro: jest.fn(),
    atualizarMembro: jest.fn(),
    removerMembro: jest.fn(),
    buscarMembros: jest.fn(),
    buscarMembroPorId: jest.fn(),
  }
}));

describe('Membro', () => {
  let membro: Membro;

  beforeEach(() => {
    membro = new Membro(
      1,
      "João Silva Santos",
      "2023001",
      "Rua das Flores, 123, São Paulo - SP",
      "(11) 98765-4321"
    );
  });

  describe('Criação e propriedades', () => {
    test('deve criar um membro com propriedades corretas', () => {
      expect(membro.idPessoa).toBe(1);
      expect(membro.nome).toBe("João Silva Santos");
      expect(membro.numeroMatricula).toBe("2023001");
      expect(membro.endereco).toBe("Rua das Flores, 123, São Paulo - SP");
      expect(membro.telefone).toBe("(11) 98765-4321");
    });

    test('deve criar membro através do método daInterface', () => {
      const dto = {
        idPessoa: 2,
        nome: "Maria Silva",
        numeroMatricula: "2023002",
        endereco: "Rua das Palmeiras, 456",
        telefone: "(11) 99999-8888"
      };

      const membroFromDTO = Membro.daInterface(dto);
      
      expect(membroFromDTO.idPessoa).toBe(2);
      expect(membroFromDTO.nome).toBe("Maria Silva");
      expect(membroFromDTO.numeroMatricula).toBe("2023002");
    });
  });

  describe('Validações', () => {
    test('deve rejeitar nome vazio', () => {
      expect(() => {
        membro.nome = "";
      }).toThrow("Você deve colocar o nome completo");
    });

    test('deve rejeitar nome muito curto', () => {
      expect(() => {
        membro.nome = "ab";
      }).toThrow("Nome deve ter entre 3 e 40 caracteres");
    });

    test('deve rejeitar nome muito longo', () => {
      expect(() => {
        membro.nome = "a".repeat(41);
      }).toThrow("Nome deve ter entre 3 e 40 caracteres");
    });

    test('deve rejeitar matrícula vazia', () => {
      expect(() => {
        membro.numeroMatricula = "";
      }).toThrow("Você deve colocar o número de matrícula");
    });

    test('deve rejeitar endereço vazio', () => {
      expect(() => {
        membro.endereco = "";
      }).toThrow("Você deve colocar o endereço");
    });

    test('deve rejeitar telefone vazio', () => {
      expect(() => {
        membro.telefone = "";
      }).toThrow("Você deve colocar o telefone");
    });
  });

  describe('Setters válidos', () => {
    test('deve aceitar nome válido', () => {
      membro.nome = "Ana Carolina";
      expect(membro.nome).toBe("Ana Carolina");
    });

    test('deve aceitar matrícula válida', () => {
      membro.numeroMatricula = "2023999";
      expect(membro.numeroMatricula).toBe("2023999");
    });

    test('deve aceitar endereço válido', () => {
      membro.endereco = "Avenida Paulista, 1000";
      expect(membro.endereco).toBe("Avenida Paulista, 1000");
    });

    test('deve aceitar telefone válido', () => {
      membro.telefone = "(11) 91111-2222";
      expect(membro.telefone).toBe("(11) 91111-2222");
    });
  });
});