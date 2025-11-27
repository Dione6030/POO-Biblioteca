import { Livro } from '../src/classes/Livro';
import { Membro } from '../src/classes/Membro';
import { Emprestimo } from '../src/classes/Emprestimo';
import { describe, expect, jest, test } from "@jest/globals";

// Mock da API
jest.mock('../src/servidor/API', () => ({
  API: {
    buscarLivros: jest.fn(),
    buscarMembros: jest.fn(),
    buscarEmprestimos: jest.fn(),
    healthCheck: jest.fn()
  }
}));

describe('Testes de Menu e Interface do Usuário', () => {
  describe('Validações de entrada do usuário', () => {
    test('deve validar dados de livro antes de criar', () => {
      // Teste de título vazio
      expect(() => {
        const livro = new Livro(1, "", "Autor", "1234567890123", new Date());
        livro.titulo = "";
      }).toThrow("O título não pode ser vazio.");

      // Teste de ISBN inválido
      expect(() => {
        const livro = new Livro(1, "Título", "Autor", "123", new Date());
        livro.ISBN = "123";
      }).toThrow("O ISBN deve ter exatamente 13 caracteres.");
    });

    test('deve validar dados de membro antes de criar', () => {
      // Teste de nome vazio
      expect(() => {
        const membro = new Membro(1, "", "123", "Endereço", "Telefone");
        membro.nome = "";
      }).toThrow("Você deve colocar o nome completo");

      // Teste de telefone vazio
      expect(() => {
        const membro = new Membro(1, "Nome", "123", "Endereço", "");
        membro.telefone = "";
      }).toThrow("Você deve colocar o telefone");
    });

    test('deve validar dados de empréstimo', () => {
      const emprestimo = new Emprestimo(1, 1, 1, new Date("2025-11-20"), 'ativo', null);
      
      // Teste de data de devolução inválida
      expect(() => {
        emprestimo.dataDevolucao = new Date("2025-11-19"); // Data anterior
      }).toThrow('A devolução não pode ser anterior ao empréstimo');

      // Teste de data de devolução válida
      emprestimo.dataDevolucao = new Date("2025-11-25"); // Data posterior
      expect(emprestimo.dataDevolucao).toEqual(new Date("2025-11-25"));
    });
  });

  describe('Fluxo de operações do menu', () => {
    test('deve simular operações básicas de cada entidade', async () => {
      // Simular criação de livro (como se fosse entrada do menu)
      const dadosLivro = {
        id: 1,
        titulo: "Livro de Teste",
        autor: "Autor de Teste",
        ISBN: "9781234567890",
        anoPublicacao: new Date("2023-01-01")
      };

      const livro = new Livro(
        dadosLivro.id,
        dadosLivro.titulo,
        dadosLivro.autor,
        dadosLivro.ISBN,
        dadosLivro.anoPublicacao
      );

      expect(livro.titulo).toBe("Livro de Teste");
      expect(livro.ISBN).toBe("9781234567890");

      // Simular criação de membro
      const dadosMembro = {
        idPessoa: 1,
        nome: "João da Silva",
        numeroMatricula: "2023001",
        endereco: "Rua das Flores, 123",
        telefone: "(11) 99999-9999"
      };

      const membro = new Membro(
        dadosMembro.idPessoa,
        dadosMembro.nome,
        dadosMembro.numeroMatricula,
        dadosMembro.endereco,
        dadosMembro.telefone
      );

      expect(membro.nome).toBe("João da Silva");
      expect(membro.numeroMatricula).toBe("2023001");

      // Simular criação de empréstimo
      const emprestimo = new Emprestimo(
        1,
        livro.idLivro,
        membro.idPessoa,
        new Date("2025-11-20"),
        'ativo',
        null
      );

      expect(emprestimo.idLivro).toBe(livro.idLivro);
      expect(emprestimo.idPessoa).toBe(membro.idPessoa);
      expect(emprestimo.status).toBe('ativo');
    });

    test('deve simular atualização de dados (como no menu)', () => {
      // Simular atualização de livro
      const livro = new Livro(1, "Título Original", "Autor", "9781234567890", new Date("2023-01-01"));
      
      // Simular entrada do usuário alterando título
      livro.titulo = "Título Atualizado";
      expect(livro.titulo).toBe("Título Atualizado");

      // Simular atualização de membro
      const membro = new Membro(1, "Nome Original", "123", "Endereço", "Telefone");
      
      // Simular entrada do usuário alterando nome
      membro.nome = "Nome Atualizado";
      expect(membro.nome).toBe("Nome Atualizado");

      // Simular devolução de empréstimo
      const emprestimo = new Emprestimo(1, 1, 1, new Date("2025-11-20"), 'ativo', null);
      
      // Simular processo de devolução
      emprestimo.status = 'devolvido';
      emprestimo.dataDevolucao = new Date("2025-11-25");
      
      expect(emprestimo.status).toBe('devolvido');
      expect(emprestimo.dataDevolucao).toEqual(new Date("2025-11-25"));
    });
  });

  describe('Casos de erro do usuário', () => {
    test('deve tratar entradas inválidas graciosamente', () => {
      // Teste com ISBN muito curto
      expect(() => {
        const livro = new Livro(1, "Título", "Autor", "123", new Date());
        livro.ISBN = "123456789"; // 9 dígitos ao invés de 13
      }).toThrow("O ISBN deve ter exatamente 13 caracteres.");

      // Teste com ano futuro
      expect(() => {
        const livro = new Livro(1, "Título", "Autor", "1234567890123", new Date());
        livro.anoPublicacao = new Date("2030-01-01");
      }).toThrow("O ano de publicação não pode ser no futuro.");

      // Teste com nome muito curto
      expect(() => {
        const membro = new Membro(1, "Ab", "123", "Endereço", "Telefone");
        membro.nome = "Ab";
      }).toThrow("Nome deve ter entre 3 e 40 caracteres");
    });

    test('deve aceitar entradas válidas', () => {
      // Dados válidos para livro
      const livro = new Livro(1, "Dom Casmurro", "Machado de Assis", "9788594318602", new Date("1899-01-01"));
      livro.titulo = "O Cortiço";
      livro.autor = "Aluísio Azevedo";
      
      expect(livro.titulo).toBe("O Cortiço");
      expect(livro.autor).toBe("Aluísio Azevedo");

      // Dados válidos para membro
      const membro = new Membro(1, "Ana", "456", "Rua A", "123");
      membro.nome = "Ana Carolina Silva";
      membro.endereco = "Avenida Paulista, 1000, São Paulo";
      
      expect(membro.nome).toBe("Ana Carolina Silva");
      expect(membro.endereco).toBe("Avenida Paulista, 1000, São Paulo");
    });
  });

  describe('Formatação de dados para exibição', () => {
    test('deve formatar datas corretamente para exibição', () => {
      const emprestimo = new Emprestimo(1, 1, 1, new Date("2025-11-20"), 'ativo', null);
      
      const dto = emprestimo.toDTO();
      expect(dto.dataEmprestimo).toBe("2025-11-20");
      expect(dto.dataDevolucao).toBeNull();
      
      // Simular devolução
      emprestimo.dataDevolucao = new Date("2025-11-25");
      const dtoAtualizado = emprestimo.toDTO();
      expect(dtoAtualizado.dataDevolucao).toBe("2025-11-25");
    });

    test('deve manter consistência nos dados de DTO', () => {
      const livroOriginal = {
        _idLivro: 1,
        _titulo: "1984",
        _autor: "George Orwell",
        _ISBN: "9788535914849",
        _anoPublicacao: "1949-06-08"
      };

      const livro = Livro.fromDTO(livroOriginal);
      expect(livro.idLivro).toBe(1);
      expect(livro.titulo).toBe("1984");
      expect(livro.autor).toBe("George Orwell");
      expect(livro.ISBN).toBe("9788535914849");
    });
  });
});