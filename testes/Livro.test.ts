import { Livro } from '../src/classes/Livro';
import { describe, expect, jest, beforeEach, test } from "@jest/globals";

// Mock da API
jest.mock('../src/servidor/API', () => ({
  API: {
    adicionarLivro: jest.fn(),
    atualizarLivro: jest.fn(),
    removerLivro: jest.fn(),
    buscarLivros: jest.fn(),
    buscarLivroPorId: jest.fn(),
  }
}));

describe('Livro', () => {
  let livro: Livro;

  beforeEach(() => {
    // Configurar um livro para teste
    livro = new Livro(1, "1984", "George Orwell", "9788535914849", new Date("1949-06-08"));
  });

  describe('Criação e propriedades', () => {
    test('deve criar um livro com propriedades corretas', () => {
      expect(livro.idLivro).toBe(1);
      expect(livro.titulo).toBe("1984");
      expect(livro.autor).toBe("George Orwell");
      expect(livro.ISBN).toBe("9788535914849");
      expect(livro.anoPublicacao).toEqual(new Date("1949-06-08"));
    });

    test('deve criar livro através do método daInterface', () => {
      const dto = {
        _idLivro: 2,
        _titulo: "Dom Casmurro",
        _autor: "Machado de Assis",
        _ISBN: "9788594318602",
        _anoPublicacao: "1899-01-01"
      };

      const livroFromDTO = Livro.daInterface(dto);
      
      expect(livroFromDTO.idLivro).toBe(2);
      expect(livroFromDTO.titulo).toBe("Dom Casmurro");
      expect(livroFromDTO.autor).toBe("Machado de Assis");
    });
  });

  describe('Validações', () => {
    test('deve rejeitar título vazio', () => {
      expect(() => {
        livro.titulo = "";
      }).toThrow("O título não pode ser vazio.");
    });

    test('deve rejeitar título muito longo', () => {
      expect(() => {
        livro.titulo = "a".repeat(41);
      }).toThrow("O título não pode ter mais de 40 caracteres.");
    });

    test('deve rejeitar autor vazio', () => {
      expect(() => {
        livro.autor = "";
      }).toThrow("O autor não pode ser vazio.");
    });

    test('deve rejeitar autor muito curto', () => {
      expect(() => {
        livro.autor = "ab";
      }).toThrow("O autor deve ter entre 3 e 40 caracteres.");
    });

    test('deve rejeitar ISBN com tamanho incorreto', () => {
      expect(() => {
        livro.ISBN = "123456789";
      }).toThrow("O ISBN deve ter exatamente 13 caracteres.");
    });

    test('deve rejeitar ano de publicação no futuro', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      expect(() => {
        livro.anoPublicacao = futureDate;
      }).toThrow("O ano de publicação não pode ser no futuro.");
    });
  });

  describe('Setters válidos', () => {
    test('deve aceitar título válido', () => {
      livro.titulo = "O Cortiço";
      expect(livro.titulo).toBe("O Cortiço");
    });

    test('deve aceitar autor válido', () => {
      livro.autor = "Aluísio Azevedo";
      expect(livro.autor).toBe("Aluísio Azevedo");
    });

    test('deve aceitar ISBN válido', () => {
      livro.ISBN = "9788525406953";
      expect(livro.ISBN).toBe("9788525406953");
    });

    test('deve aceitar ano de publicação válido', () => {
      const validDate = new Date("2020-01-01");
      livro.anoPublicacao = validDate;
      expect(livro.anoPublicacao).toEqual(validDate);
    });
  });
});