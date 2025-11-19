export class API {
    private static readonly BASE_URL = 'http://localhost:3000';

    private static async makeRequest(url: string, options: any = {}): Promise<any> {

        if (typeof fetch !== 'undefined') {
            const requestInit: any = {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            if (options.body) {
                requestInit.body = JSON.stringify(options.body);
            }

            const response = await fetch(url, requestInit);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            return await response.json();
        } else {

            throw new Error('fetch não está disponível. Use Node.js 18+ ou instale node-fetch.');
        }
    }

    private static async encontrarLivroPorIdLivro(idLivro: number): Promise<any> {
        const livros = await this.makeRequest(`${this.BASE_URL}/livros?idLivro=${idLivro}`);
        return livros.length > 0 ? livros[0] : null;
    }

    private static async encontrarMembroPorIdPessoa(idPessoa: number): Promise<any> {
        const membros = await this.makeRequest(`${this.BASE_URL}/membros?idPessoa=${idPessoa}`);
        return membros.length > 0 ? membros[0] : null;
    }

    private static async encontrarEmprestimoPorIdEmprestimo(idEmprestimo: number): Promise<any> {
        const emprestimos = await this.makeRequest(`${this.BASE_URL}/emprestimos?idEmprestimo=${idEmprestimo}`);
        return emprestimos.length > 0 ? emprestimos[0] : null;
    }

    static async buscarLivros(): Promise<any[]> {
        try {
            return await this.makeRequest(`${this.BASE_URL}/livros`);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            throw error;
        }
    }

    static async buscarLivroPorId(idLivro: number): Promise<any> {
        try {
            const livro = await this.encontrarLivroPorIdLivro(idLivro);
            if (!livro) {
                throw new Error(`Livro com ID ${idLivro} não encontrado`);
            }
            return livro;
        } catch (error) {
            console.error(`Erro ao buscar livro com ID ${idLivro}:`, error);
            throw error;
        }
    }

    static async adicionarLivro(livro: any): Promise<any> {
        try {
            const novoLivro = { 
                ...livro
            };
            
            return await this.makeRequest(`${this.BASE_URL}/livros`, {
                method: 'POST',
                body: novoLivro
            });
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
            throw error;
        }
    }

    static async atualizarLivro(idLivro: number, dadosLivro: any): Promise<any> {
        try {
            const livro = await this.encontrarLivroPorIdLivro(idLivro);
            if (!livro) {
                throw new Error(`Livro com ID ${idLivro} não encontrado`);
            }
            
            const livroAtualizado = { ...livro, ...dadosLivro };
            return await this.makeRequest(`${this.BASE_URL}/livros/${livro.id}`, {
                method: 'PUT',
                body: livroAtualizado
            });
        } catch (error) {
            console.error(`Erro ao atualizar livro com ID ${idLivro}:`, error);
            throw error;
        }
    }

    static async removerLivro(idLivro: number): Promise<void> {
        try {
            const livro = await this.encontrarLivroPorIdLivro(idLivro);
            if (!livro) {
                throw new Error(`Livro com ID ${idLivro} não encontrado`);
            }
            
            await this.makeRequest(`${this.BASE_URL}/livros/${livro.id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error(`Erro ao remover livro com ID ${idLivro}:`, error);
            throw error;
        }
    }

    static async buscarMembros(): Promise<any[]> {
        try {
            return await this.makeRequest(`${this.BASE_URL}/membros`);
        } catch (error) {
            console.error('Erro ao buscar membros:', error);
            throw error;
        }
    }

    static async buscarMembroPorId(idPessoa: number): Promise<any> {
        try {
            const membro = await this.encontrarMembroPorIdPessoa(idPessoa);
            if (!membro) {
                throw new Error(`Membro com ID ${idPessoa} não encontrado`);
            }
            return membro;
        } catch (error) {
            console.error(`Erro ao buscar membro com ID ${idPessoa}:`, error);
            throw error;
        }
    }
    static async buscarMembroPorNome(nomePessoa: string): Promise<any> {
        try {
            const membros = await this.makeRequest(`${this.BASE_URL}/membros?nome=${encodeURIComponent(nomePessoa)}`);
            if (membros.length === 0) {
                throw new Error(`Membro com nome ${nomePessoa} não encontrado`);
            }
            return membros;
        } catch (error) {
            console.error(`Erro ao buscar membro com nome ${nomePessoa}:`, error);
            throw error;
        }
    }

    static async adicionarMembro(membro: any): Promise<any> {
        try {
            const novoMembro = { 
                ...membro
            };
            
            return await this.makeRequest(`${this.BASE_URL}/membros`, {
                method: 'POST',
                body: novoMembro
            });
        } catch (error) {
            console.error('Erro ao adicionar membro:', error);
            throw error;
        }
    }

    static async atualizarMembro(idPessoa: number, dadosMembro: any): Promise<any> {
        try {
            const membro = await this.encontrarMembroPorIdPessoa(idPessoa);
            if (!membro) {
                throw new Error(`Membro com ID ${idPessoa} não encontrado`);
            }
            
            const membroAtualizado = { ...membro, ...dadosMembro };
            return await this.makeRequest(`${this.BASE_URL}/membros/${membro.id}`, {
                method: 'PUT',
                body: membroAtualizado
            });
        } catch (error) {
            console.error(`Erro ao atualizar membro com ID ${idPessoa}:`, error);
            throw error;
        }
    }

    static async removerMembro(idPessoa: number): Promise<void> {
        try {
            const membro = await this.encontrarMembroPorIdPessoa(idPessoa);
            if (!membro) {
                throw new Error(`Membro com ID ${idPessoa} não encontrado`);
            }
            
            await this.makeRequest(`${this.BASE_URL}/membros/${membro.id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error(`Erro ao remover membro com ID ${idPessoa}:`, error);
            throw error;
        }
    }

    static async buscarEmprestimos(): Promise<any[]> {
        try {
            return await this.makeRequest(`${this.BASE_URL}/emprestimos`);
        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
            throw error;
        }
    }

    static async buscarEmprestimosPorStatus(status: string): Promise<any[]> {
        try {
            return await this.makeRequest(`${this.BASE_URL}/emprestimos?status=${status}`);
        } catch (error) {
            console.error(`Erro ao buscar empréstimos com status ${status}:`, error);
            throw error;
        }
    }

    static async buscarEmprestimoPorId(idEmprestimo: number): Promise<any> {
        try {
            const emprestimo = await this.encontrarEmprestimoPorIdEmprestimo(idEmprestimo);
            if (!emprestimo) {
                throw new Error(`Empréstimo com ID ${idEmprestimo} não encontrado`);
            }
            return emprestimo;
        } catch (error) {
            console.error(`Erro ao buscar empréstimo com ID ${idEmprestimo}:`, error);
            throw error;
        }
    }

    static async adicionarEmprestimo(emprestimo: any): Promise<any> {
        try {
            const novoEmprestimo = { 
                ...emprestimo
            };
            
            return await this.makeRequest(`${this.BASE_URL}/emprestimos`, {
                method: 'POST',
                body: novoEmprestimo
            });
        } catch (error) {
            console.error('Erro ao adicionar empréstimo:', error);
            throw error;
        }
    }

    static async atualizarEmprestimo(idEmprestimo: number, dadosEmprestimo: any): Promise<any> {
        try {
            const emprestimo = await this.encontrarEmprestimoPorIdEmprestimo(idEmprestimo);
            if (!emprestimo) {
                throw new Error(`Empréstimo com ID ${idEmprestimo} não encontrado`);
            }
            
            const emprestimoAtualizado = { ...emprestimo, ...dadosEmprestimo };
            return await this.makeRequest(`${this.BASE_URL}/emprestimos/${emprestimo.id}`, {
                method: 'PUT',
                body: emprestimoAtualizado
            });
        } catch (error) {
            console.error(`Erro ao atualizar empréstimo com ID ${idEmprestimo}:`, error);
            throw error;
        }
    }

    static async removerEmprestimo(idEmprestimo: number): Promise<void> {
        try {
            const emprestimo = await this.encontrarEmprestimoPorIdEmprestimo(idEmprestimo);
            if (!emprestimo) {
                throw new Error(`Empréstimo com ID ${idEmprestimo} não encontrado`);
            }
            
            await this.makeRequest(`${this.BASE_URL}/emprestimos/${emprestimo.id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error(`Erro ao remover empréstimo com ID ${idEmprestimo}:`, error);
            throw error;
        }
    }
}