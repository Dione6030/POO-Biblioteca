import { Livro } from '../src/classes/Livro';
import { Membro } from '../src/classes/Membro';
import { Emprestimo } from '../src/classes/Emprestimo';
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
    adicionarEmprestimo: jest.fn(),
    atualizarEmprestimo: jest.fn(),
    removerEmprestimo: jest.fn(),
    buscarEmprestimosPorStatus: jest.fn(),
    healthCheck: jest.fn(),
  }
}));

const mockAPI = API as jest.Mocked<typeof API>;

describe('Testes de Integração - Fluxo Completo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fluxo de Gerenciamento de Livros', () => {
    test('deve criar, listar, atualizar e remover livros', async () => {
      // Mock dos dados
      const livroData = {
        idLivro: 1,
        titulo: "O Alquimista",
        autor: "Paulo Coelho",
        ISBN: "9788576657620",
        anoPublicacao: new Date("1988-01-01")
      };

      const livroDTO = {
        _idLivro: 1,
        _titulo: "O Alquimista",
        _autor: "Paulo Coelho",
        _ISBN: "9788576657620",
        _anoPublicacao: "1988-01-01",
        id: "abc123"
      };

      // Configurar mocks
      mockAPI.adicionarLivro.mockResolvedValue(livroDTO);
      mockAPI.buscarLivros.mockResolvedValue([livroDTO]);
      mockAPI.buscarLivroPorId.mockResolvedValue(livroDTO);
      mockAPI.atualizarLivro.mockResolvedValue({ ...livroDTO, _titulo: "O Alquimista - Edição Especial" });

      // Criar livro
      const novoLivro = new Livro(
        livroData.idLivro,
        livroData.titulo,
        livroData.autor,
        livroData.ISBN,
        livroData.anoPublicacao
      );

      const livroCriado = await novoLivro.adicionar(novoLivro);
      expect(mockAPI.adicionarLivro).toHaveBeenCalledWith(
        expect.objectContaining({
          _titulo: "O Alquimista",
          _autor: "Paulo Coelho"
        })
      );

      // Listar livros
      const livros = await Livro.listarTodos();
      expect(mockAPI.buscarLivros).toHaveBeenCalled();
      expect(livros).toHaveLength(1);
      expect(livros[0]?.titulo).toBe("O Alquimista");

      // Buscar por ID
      const livroEncontrado = await Livro.obterPorId(1);
      expect(mockAPI.buscarLivroPorId).toHaveBeenCalledWith(1);
      expect(livroEncontrado.titulo).toBe("O Alquimista");

      // Atualizar livro
      const livroAtualizado = await livroEncontrado.atualizar(livroEncontrado);
      expect(mockAPI.atualizarLivro).toHaveBeenCalledWith(1, expect.any(Object));

      //Remover livro
      await livroEncontrado.remover(1);
      expect(mockAPI.removerLivro).toHaveBeenCalledWith(1);
    });
  });

  describe('Fluxo de Gerenciamento de Membros', () => {
    test('deve criar, listar, atualizar e remover membros', async () => {
      // Mock dos dados
      const membroData = {
        idPessoa: 1,
        nome: "Carlos Oliveira",
        numeroMatricula: "2023010",
        endereco: "Rua das Acácias, 100",
        telefone: "(11) 98888-7777"
      };

      // Configurar mocks
      mockAPI.adicionarMembro.mockResolvedValue({ ...membroData, id: "def456" });
      mockAPI.buscarMembros.mockResolvedValue([{ ...membroData, id: "def456" }]);
      mockAPI.buscarMembroPorId.mockResolvedValue({ ...membroData, id: "def456" });
      mockAPI.atualizarMembro.mockResolvedValue({ 
        ...membroData, 
        nome: "Carlos Oliveira Silva",
        id: "def456"
      });

      // Criar membro
      const novoMembro = new Membro(
        membroData.idPessoa,
        membroData.nome,
        membroData.numeroMatricula,
        membroData.endereco,
        membroData.telefone
      );

      const membroCriado = await novoMembro.adicionar(novoMembro);
      expect(mockAPI.adicionarMembro).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Carlos Oliveira",
          numeroMatricula: "2023010"
        })
      );

      // Listar membros
      const membros = await Membro.listarTodos();
      expect(mockAPI.buscarMembros).toHaveBeenCalled();
      expect(membros).toHaveLength(1);
      expect(membros[0]?.nome).toBe("Carlos Oliveira");

      // Buscar por ID
      const membroEncontrado = await Membro.obterPorId(1);
      expect(mockAPI.buscarMembroPorId).toHaveBeenCalledWith(1);
      expect(membroEncontrado.nome).toBe("Carlos Oliveira");

      // Atualizar membro
      const membroAtualizado = await membroEncontrado.atualizar(membroEncontrado);
      expect(mockAPI.atualizarMembro).toHaveBeenCalledWith(1, expect.any(Object));

      // Remover membro
      await membroEncontrado.remover(1);
      expect(mockAPI.removerMembro).toHaveBeenCalledWith(1);
    });
  });

  describe('Fluxo de Gerenciamento de Empréstimos', () => {
    test('deve criar, listar e atualizar empréstimos', async () => {
      // Mock dos dados
      const emprestimoData = {
        idEmprestimo: 1,
        idLivro: 1,
        idPessoa: 1,
        dataEmprestimo: "2025-11-20",
        dataDevolucao: null,
        status: "ativo"
      };

      // Configurar mocks
      mockAPI.adicionarEmprestimo.mockResolvedValue({ ...emprestimoData, id: "ghi789" });
      mockAPI.buscarEmprestimos.mockResolvedValue([{ ...emprestimoData, id: "ghi789" }]);
      mockAPI.buscarEmprestimosPorStatus.mockResolvedValue([{ ...emprestimoData, id: "ghi789" }]);
      mockAPI.buscarEmprestimoPorId.mockResolvedValue({ ...emprestimoData, id: "ghi789" });
      mockAPI.atualizarEmprestimo.mockResolvedValue({ 
        ...emprestimoData, 
        status: "devolvido",
        dataDevolucao: "2025-11-25",
        id: "ghi789"
      });

      // Criar empréstimo
      const novoEmprestimo = new Emprestimo(
        emprestimoData.idEmprestimo,
        emprestimoData.idLivro,
        emprestimoData.idPessoa,
        new Date(emprestimoData.dataEmprestimo),
        'ativo',
        null
      );

      const emprestimoCriado = await novoEmprestimo.adicionar(novoEmprestimo);
      expect(mockAPI.adicionarEmprestimo).toHaveBeenCalledWith(
        expect.objectContaining({
          idLivro: 1,
          idPessoa: 1,
          status: "ativo"
        })
      );

      // Listar todos os empréstimos
      const emprestimos = await Emprestimo.listar();
      expect(mockAPI.buscarEmprestimos).toHaveBeenCalled();
      expect(emprestimos).toHaveLength(1);
      expect(emprestimos[0]?.status).toBe("ativo");

      // Listar apenas empréstimos ativos
      const emprestimosAtivos = await Emprestimo.listarSomenteAtivos();
      expect(mockAPI.buscarEmprestimosPorStatus).toHaveBeenCalledWith('ativo');
      expect(emprestimosAtivos).toHaveLength(1);

      // Buscar por ID
      const emprestimoEncontrado = await Emprestimo.obterPorId(1);
      expect(mockAPI.buscarEmprestimoPorId).toHaveBeenCalledWith(1);
      expect(emprestimoEncontrado.status).toBe("ativo");

      // Atualizar empréstimo (devolver)
      emprestimoEncontrado.status = "devolvido";
      emprestimoEncontrado.dataDevolucao = new Date("2025-11-25");
      
      const emprestimoAtualizado = await emprestimoEncontrado.atualizar(emprestimoEncontrado);
      expect(mockAPI.atualizarEmprestimo).toHaveBeenCalledWith(1, expect.any(Object));

      // Remover empréstimo
      await emprestimoEncontrado.remover(1);
      expect(mockAPI.removerEmprestimo).toHaveBeenCalledWith(1);
    });
  });

  describe('Cenário Completo de Biblioteca', () => {
    test('deve simular um fluxo completo de biblioteca', async () => {
      // Configurar mocks para um cenário completo
      const livroMock = {
        _idLivro: 1,
        _titulo: "Harry Potter",
        _autor: "J.K. Rowling",
        _ISBN: "9788532511010",
        _anoPublicacao: "1997-06-26",
        id: "livro1"
      };

      const membroMock = {
        idPessoa: 1,
        nome: "Ana Silva",
        numeroMatricula: "2023100",
        endereco: "Rua Principal, 200",
        telefone: "(11) 99999-0000",
        id: "membro1"
      };

      const emprestimoMock = {
        idEmprestimo: 1,
        idLivro: 1,
        idPessoa: 1,
        dataEmprestimo: "2025-11-20",
        dataDevolucao: null,
        status: "ativo",
        id: "emprestimo1"
      };

      // Configurar todos os mocks
      mockAPI.adicionarLivro.mockResolvedValue(livroMock);
      mockAPI.adicionarMembro.mockResolvedValue(membroMock);
      mockAPI.adicionarEmprestimo.mockResolvedValue(emprestimoMock);
      mockAPI.buscarLivroPorId.mockResolvedValue(livroMock);
      mockAPI.buscarMembroPorId.mockResolvedValue(membroMock);

      // Passo 1: Adicionar livro
      const livro = new Livro(1, "Harry Potter", "J.K. Rowling", "9788532511010", new Date("1997-06-26"));
      await livro.adicionar(livro);

      // Passo 2: Adicionar membro
      const membro = new Membro(1, "Ana Silva", "2023100", "Rua Principal, 200", "(11) 99999-0000");
      await membro.adicionar(membro);

      // Passo 3: Criar empréstimo
      const emprestimo = new Emprestimo(1, 1, 1, new Date("2025-11-20"), 'ativo', null);
      await emprestimo.adicionar(emprestimo);

      // Verificar se todas as operações foram chamadas
      expect(mockAPI.adicionarLivro).toHaveBeenCalledTimes(1);
      expect(mockAPI.adicionarMembro).toHaveBeenCalledTimes(1);
      expect(mockAPI.adicionarEmprestimo).toHaveBeenCalledTimes(1);

      // Verificar se os dados estão corretos
      expect(mockAPI.adicionarEmprestimo).toHaveBeenCalledWith(
        expect.objectContaining({
          idLivro: 1,
          idPessoa: 1,
          status: "ativo"
        })
      );
    });
  });
});