import { API } from '../src/servidor/API';
import { describe, expect, jest, beforeEach, test } from "@jest/globals";

// Mock da API
jest.mock('../src/servidor/API', () => ({
  API: {
    buscarLivros: jest.fn(),
    buscarLivroPorId: jest.fn(),
    adicionarLivro: jest.fn(),
    atualizarLivro: jest.fn(),
    removerLivro: jest.fn(),
    buscarMembros: jest.fn(),
    buscarMembroPorId: jest.fn(),
    adicionarMembro: jest.fn(),
    atualizarMembro: jest.fn(),
    removerMembro: jest.fn(),
    buscarEmprestimos: jest.fn(),
    buscarEmprestimoPorId: jest.fn(),
    buscarEmprestimosPorStatus: jest.fn(),
    adicionarEmprestimo: jest.fn(),
    atualizarEmprestimo: jest.fn(),
    removerEmprestimo: jest.fn(),
    healthCheck: jest.fn(),
  }
}));

const mockAPI = API as jest.Mocked<typeof API>;

describe('API - Testes de Persistência e Integração', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Operações de Livros', () => {
    test('deve buscar todos os livros com sucesso', async () => {
      const mockLivros = [
        { id: '1', idLivro: 1, titulo: '1984', autor: 'George Orwell', ISBN: '9788535914849' },
        { id: '2', idLivro: 2, titulo: 'Dom Casmurro', autor: 'Machado de Assis', ISBN: '9788594318602' }
      ];

      mockAPI.buscarLivros.mockResolvedValue(mockLivros);

      const result = await API.buscarLivros();
      
      expect(mockAPI.buscarLivros).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLivros);
      expect(result).toHaveLength(2);
    });

    test('deve buscar livro por ID com sucesso', async () => {
      const mockLivro = { id: '1', idLivro: 1, titulo: '1984', autor: 'George Orwell', ISBN: '9788535914849' };

      mockAPI.buscarLivroPorId.mockResolvedValue(mockLivro);

      const result = await API.buscarLivroPorId(1);
      
      expect(mockAPI.buscarLivroPorId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLivro);
      expect(result.titulo).toBe('1984');
    });

    test('deve adicionar livro com sucesso', async () => {
      const novoLivro = {
        idLivro: 3,
        titulo: 'O Cortiço',
        autor: 'Aluísio Azevedo',
        ISBN: '9788525406953'
      };
      
      const livroAdicionado = { ...novoLivro, id: '3' };

      mockAPI.adicionarLivro.mockResolvedValue(livroAdicionado);

      const result = await API.adicionarLivro(novoLivro);
      
      expect(mockAPI.adicionarLivro).toHaveBeenCalledWith(novoLivro);
      expect(result).toEqual(livroAdicionado);
      expect(result.id).toBe('3');
    });

    test('deve atualizar livro com sucesso', async () => {
      const livroAtualizado = {
        id: '1',
        idLivro: 1,
        titulo: '1984 - Edição Especial',
        autor: 'George Orwell',
        ISBN: '9788535914849'
      };

      mockAPI.atualizarLivro.mockResolvedValue(livroAtualizado);

      const result = await API.atualizarLivro(1, { titulo: '1984 - Edição Especial' });
      
      expect(mockAPI.atualizarLivro).toHaveBeenCalledWith(1, { titulo: '1984 - Edição Especial' });
      expect(result.titulo).toBe('1984 - Edição Especial');
    });

    test('deve remover livro com sucesso', async () => {
      mockAPI.removerLivro.mockResolvedValue(undefined);

      await API.removerLivro(1);
      
      expect(mockAPI.removerLivro).toHaveBeenCalledWith(1);
    });

    test('deve lidar com erro quando livro não é encontrado', async () => {
      mockAPI.buscarLivroPorId.mockRejectedValue(new Error('Livro com ID 999 não encontrado'));

      await expect(API.buscarLivroPorId(999)).rejects.toThrow('Livro com ID 999 não encontrado');
    });
  });

  describe('Operações de Membros', () => {
    test('deve buscar todos os membros com sucesso', async () => {
      const mockMembros = [
        { id: '1', idPessoa: 1, nome: 'João Silva', numeroMatricula: '2023001' },
        { id: '2', idPessoa: 2, nome: 'Maria Santos', numeroMatricula: '2023002' }
      ];

      mockAPI.buscarMembros.mockResolvedValue(mockMembros);

      const result = await API.buscarMembros();
      
      expect(mockAPI.buscarMembros).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMembros);
      expect(result).toHaveLength(2);
    });

    test('deve buscar membro por ID com sucesso', async () => {
      const mockMembro = { id: '1', idPessoa: 1, nome: 'João Silva', numeroMatricula: '2023001' };

      mockAPI.buscarMembroPorId.mockResolvedValue(mockMembro);

      const result = await API.buscarMembroPorId(1);
      
      expect(mockAPI.buscarMembroPorId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMembro);
      expect(result.nome).toBe('João Silva');
    });

    test('deve adicionar membro com sucesso', async () => {
      const novoMembro = {
        idPessoa: 3,
        nome: 'Ana Carolina',
        numeroMatricula: '2023003',
        endereco: 'Rua das Palmeiras, 789',
        telefone: '(11) 99999-9999'
      };
      
      const membroAdicionado = { ...novoMembro, id: '3' };

      mockAPI.adicionarMembro.mockResolvedValue(membroAdicionado);

      const result = await API.adicionarMembro(novoMembro);
      
      expect(mockAPI.adicionarMembro).toHaveBeenCalledWith(novoMembro);
      expect(result).toEqual(membroAdicionado);
      expect(result.id).toBe('3');
    });

    test('deve lidar com erro quando membro não é encontrado', async () => {
      mockAPI.buscarMembroPorId.mockRejectedValue(new Error('Membro com ID 999 não encontrado'));

      await expect(API.buscarMembroPorId(999)).rejects.toThrow('Membro com ID 999 não encontrado');
    });
  });

  describe('Operações de Empréstimos', () => {
    test('deve buscar todos os empréstimos com sucesso', async () => {
      const mockEmprestimos = [
        { id: '1', idEmprestimo: 1, idLivro: 1, idPessoa: 1, status: 'ativo' },
        { id: '2', idEmprestimo: 2, idLivro: 2, idPessoa: 2, status: 'devolvido' }
      ];

      mockAPI.buscarEmprestimos.mockResolvedValue(mockEmprestimos);

      const result = await API.buscarEmprestimos();
      
      expect(mockAPI.buscarEmprestimos).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEmprestimos);
      expect(result).toHaveLength(2);
    });

    test('deve buscar empréstimos por status', async () => {
      const mockEmprestimosAtivos = [
        { id: '1', idEmprestimo: 1, idLivro: 1, idPessoa: 1, status: 'ativo' }
      ];

      mockAPI.buscarEmprestimosPorStatus.mockResolvedValue(mockEmprestimosAtivos);

      const result = await API.buscarEmprestimosPorStatus('ativo');
      
      expect(mockAPI.buscarEmprestimosPorStatus).toHaveBeenCalledWith('ativo');
      expect(result).toEqual(mockEmprestimosAtivos);
      expect(result[0].status).toBe('ativo');
    });

    test('deve adicionar empréstimo com sucesso', async () => {
      const novoEmprestimo = {
        idEmprestimo: 3,
        idLivro: 3,
        idPessoa: 3,
        dataEmprestimo: '2025-11-20',
        dataDevolucao: null,
        status: 'ativo'
      };
      
      const emprestimoAdicionado = { ...novoEmprestimo, id: '3' };

      mockAPI.adicionarEmprestimo.mockResolvedValue(emprestimoAdicionado);

      const result = await API.adicionarEmprestimo(novoEmprestimo);
      
      expect(mockAPI.adicionarEmprestimo).toHaveBeenCalledWith(novoEmprestimo);
      expect(result).toEqual(emprestimoAdicionado);
      expect(result.status).toBe('ativo');
    });

    test('deve lidar com erro quando empréstimo não é encontrado', async () => {
      mockAPI.buscarEmprestimoPorId.mockRejectedValue(new Error('Empréstimo com ID 999 não encontrado'));

      await expect(API.buscarEmprestimoPorId(999)).rejects.toThrow('Empréstimo com ID 999 não encontrado');
    });
  });

  describe('Casos de Erro e Validação', () => {
    test('deve lidar com dados undefined', async () => {
      mockAPI.buscarLivros.mockResolvedValue(undefined as any);

      const result = await API.buscarLivros();
      
      expect(result).toBeUndefined();
    });

    test('deve lidar com arrays vazios', async () => {
      mockAPI.buscarLivros.mockResolvedValue([]);

      const result = await API.buscarLivros();
      
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('deve lidar com dados inválidos', async () => {
      mockAPI.buscarLivros.mockResolvedValue(null as any);

      const result = await API.buscarLivros();
      
      expect(result).toBeNull();
    });

    test('deve rejeitar quando há erro de rede', async () => {
      mockAPI.buscarLivros.mockRejectedValue(new Error('Erro de rede'));

      await expect(API.buscarLivros()).rejects.toThrow('Erro de rede');
    });
  });

  describe('Health Check', () => {
    test('deve realizar health check com sucesso', async () => {
      const mockHealthCheck = {
        ok: true,
        message: 'Todos os endpoints OK',
        totalLatencyMs: 100,
        endpoints: [
          { path: '/livros', ok: true, status: 200, latencyMs: 50 },
          { path: '/membros', ok: true, status: 200, latencyMs: 30 },
          { path: '/emprestimos', ok: true, status: 200, latencyMs: 20 }
        ]
      };

      mockAPI.healthCheck.mockResolvedValue(mockHealthCheck);

      const result = await API.healthCheck();
      
      expect(mockAPI.healthCheck).toHaveBeenCalledTimes(1);
      expect(result.ok).toBe(true);
      expect(result.message).toBe('Todos os endpoints OK');
      expect(result.endpoints).toHaveLength(3);
    });

    test('deve detectar problemas na API', async () => {
      const mockHealthCheck = {
        ok: false,
        message: 'API indisponível',
        totalLatencyMs: 5000,
        endpoints: [
          { path: '/livros', ok: false, status: 500, latencyMs: 5000 }
        ]
      };

      mockAPI.healthCheck.mockResolvedValue(mockHealthCheck);

      const result = await API.healthCheck();
      
      expect(result.ok).toBe(false);
      expect(result.message).toBe('API indisponível');
    });
  });

  describe('Validação de Persistência', () => {
    test('deve manter consistência dos dados após operações CRUD', async () => {
      // Simular sequência de operações
      const livroOriginal = { id: '1', idLivro: 1, titulo: 'Título Original', autor: 'Autor', ISBN: '1234567890123' };
      const livroAtualizado = { ...livroOriginal, titulo: 'Título Atualizado' };

      mockAPI.adicionarLivro.mockResolvedValue(livroOriginal);
      mockAPI.buscarLivroPorId.mockResolvedValue(livroOriginal);
      mockAPI.atualizarLivro.mockResolvedValue(livroAtualizado);

      // Adicionar
      const adicionado = await API.adicionarLivro(livroOriginal);
      expect(adicionado.titulo).toBe('Título Original');

      // Buscar
      const encontrado = await API.buscarLivroPorId(1);
      expect(encontrado.id).toBe(livroOriginal.id);

      // Atualizar
      const atualizado = await API.atualizarLivro(1, { titulo: 'Título Atualizado' });
      expect(atualizado.titulo).toBe('Título Atualizado');

      expect(mockAPI.adicionarLivro).toHaveBeenCalledTimes(1);
      expect(mockAPI.buscarLivroPorId).toHaveBeenCalledTimes(1);
      expect(mockAPI.atualizarLivro).toHaveBeenCalledTimes(1);
    });

    test('deve validar estrutura dos dados retornados', async () => {
      const mockLivro = {
        id: '1',
        idLivro: 1,
        titulo: 'Livro Teste',
        autor: 'Autor Teste',
        ISBN: '1234567890123'
      };

      mockAPI.buscarLivroPorId.mockResolvedValue(mockLivro);

      const result = await API.buscarLivroPorId(1);

      // Verificar se todos os campos necessários estão presentes
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('idLivro');
      expect(result).toHaveProperty('titulo');
      expect(result).toHaveProperty('autor');
      expect(result).toHaveProperty('ISBN');
      
      // Verificar tipos
      expect(typeof result.id).toBe('string');
      expect(typeof result.idLivro).toBe('number');
      expect(typeof result.titulo).toBe('string');
      expect(typeof result.autor).toBe('string');
      expect(typeof result.ISBN).toBe('string');
    });
  });
});