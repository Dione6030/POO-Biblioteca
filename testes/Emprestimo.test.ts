import { Emprestimo } from '../src/classes/Emprestimo';
import { describe, expect, jest, beforeEach, test } from "@jest/globals";

// Mock da API
jest.mock('../src/servidor/API', () => ({
  API: {
    adicionarEmprestimo: jest.fn(),
    atualizarEmprestimo: jest.fn(),
    removerEmprestimo: jest.fn(),
    buscarEmprestimos: jest.fn(),
    buscarEmprestimoPorId: jest.fn(),
    buscarEmprestimosPorStatus: jest.fn(),
  }
}));

describe('Emprestimo', () => {
  let emprestimo: Emprestimo;
  const dataEmprestimo = new Date("2025-11-01");

  beforeEach(() => {
    emprestimo = new Emprestimo(1, 2, 3, dataEmprestimo, 'ativo', null);
  });

  describe('Criação e propriedades', () => {
    test('deve criar um empréstimo com propriedades corretas', () => {
      expect(emprestimo.idEmprestimo).toBe(1);
      expect(emprestimo.idLivro).toBe(2);
      expect(emprestimo.idPessoa).toBe(3);
      expect(emprestimo.dataEmprestimo).toEqual(dataEmprestimo);
      expect(emprestimo.status).toBe('ativo');
      expect(emprestimo.dataDevolucao).toBeNull();
    });

    test('deve criar empréstimo através do método fromDTO', () => {
      const dto = {
        idEmprestimo: 2,
        idLivro: 3,
        idPessoa: 1,
        dataEmprestimo: "2025-11-15",
        dataDevolucao: null,
        status: 'ativo'
      };

      const emprestimoFromDTO = Emprestimo.fromDTO(dto);
      
      expect(emprestimoFromDTO.idEmprestimo).toBe(2);
      expect(emprestimoFromDTO.idLivro).toBe(3);
      expect(emprestimoFromDTO.idPessoa).toBe(1);
      expect(emprestimoFromDTO.status).toBe('ativo');
    });

    test('deve converter para DTO corretamente', () => {
      const dto = emprestimo.toDTO();
      
      expect(dto.idEmprestimo).toBe(1);
      expect(dto.idLivro).toBe(2);
      expect(dto.idPessoa).toBe(3);
      expect(dto.status).toBe('ativo');
      expect(dto.dataDevolucao).toBeNull();
    });
  });

  describe('Validações de data', () => {
    test('deve rejeitar data de devolução anterior à data de empréstimo', () => {
      const dataAnterior = new Date("2025-10-15"); // Anterior à data de empréstimo
      
      expect(() => {
        emprestimo.dataDevolucao = dataAnterior;
      }).toThrow('A devolução não pode ser anterior ao empréstimo');
    });

    test('deve aceitar data de devolução posterior à data de empréstimo', () => {
      const dataPosterior = new Date("2025-11-15"); // Posterior à data de empréstimo
      
      emprestimo.dataDevolucao = dataPosterior;
      expect(emprestimo.dataDevolucao).toEqual(dataPosterior);
    });
  });

  describe('Setters', () => {
    test('deve permitir alterar idLivro', () => {
      emprestimo.idLivro = 5;
      expect(emprestimo.idLivro).toBe(5);
    });

    test('deve permitir alterar idPessoa', () => {
      emprestimo.idPessoa = 7;
      expect(emprestimo.idPessoa).toBe(7);
    });

    test('deve permitir alterar status', () => {
      emprestimo.status = 'devolvido';
      expect(emprestimo.status).toBe('devolvido');
    });

    test('deve permitir alterar data de empréstimo', () => {
      const novaData = new Date("2025-11-05");
      emprestimo.dataEmprestimo = novaData;
      expect(emprestimo.dataEmprestimo).toEqual(novaData);
    });
  });

  describe('Parsing de datas', () => {
    test('deve parsear data no formato DD/MM/YYYY', () => {
      const dto = {
        idEmprestimo: 3,
        idLivro: 1,
        idPessoa: 1,
        dataEmprestimo: "15/11/2025",
        dataDevolucao: null,
        status: 'ativo'
      };

      const emp = Emprestimo.fromDTO(dto);
      expect(emp.dataEmprestimo.getDate()).toBe(15);
      expect(emp.dataEmprestimo.getMonth()).toBe(10);
      expect(emp.dataEmprestimo.getFullYear()).toBe(2025);
    });

    test('deve parsear data no formato ISO', () => {
      const dto = {
        idEmprestimo: 4,
        idLivro: 1,
        idPessoa: 1,
        dataEmprestimo: "2025-11-20T00:00:00.000Z",
        dataDevolucao: null,
        status: 'ativo'
      };

      const emp = Emprestimo.fromDTO(dto);
      expect(emp.dataEmprestimo.getUTCDate()).toBe(20);
      expect(emp.dataEmprestimo.getUTCMonth()).toBe(10);
      expect(emp.dataEmprestimo.getUTCFullYear()).toBe(2025);
    });
  });
});