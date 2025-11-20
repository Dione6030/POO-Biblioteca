export class API {
    private static readonly BASE_URL = 'http://localhost:3000';

    private static async makeRequest(url: string, options: any = {}): Promise<any> {
        
        //Faz com que a API tente até 3 vezes em caso de falha
        const maxTentativas = 3;
        const delayAPI = 1000;
        let lastError: any = null;

        if (typeof fetch !== 'undefined') {
            for (let attempt = 0; attempt < maxTentativas; attempt++) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000);
                    const requestInit: any = {
                        method: options.method || 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Connection': 'keep-alive',
                            ...options.headers
                        },
                        signal: controller.signal
                    };

                    if (options.body) {
                        requestInit.body = JSON.stringify(options.body);
                    }

                    const response = await fetch(url, requestInit);
                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`Erro HTTP: ${response.status}`);
                    }

                    return await response.json();
                } catch (error) {
                    lastError = error;
                    
                    if (attempt === 0) {
                        console.warn(`Primeira tentativa falhou para ${url}. Tentando novamente...`);
                    } else if (attempt === maxTentativas - 1) {
                        console.error(`Todas as tentativas falharam para ${url}:`, error);
                        throw error;
                    }

                    if (attempt < maxTentativas - 1) {
                        await new Promise(resolve => setTimeout(resolve, delayAPI));
                    }
                }
            }
        }
        
        throw new Error('Fetch não está disponível');
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

    // Health check avançado: verifica múltiplos recursos, latência e status HTTP.
    static async healthCheck(options: { timeoutMs?: number; endpoints?: string[]; requireAll?: boolean } = {}): Promise<{
        ok: boolean;
        message: string;
        totalLatencyMs: number;
        endpoints: Array<{ path: string; ok: boolean; status: number | null; latencyMs: number | null; error?: string }>
    }> {
        const { timeoutMs = 2500, endpoints = ['/membros?_limit=1', '/livros?_limit=1', '/emprestimos?_limit=1'], requireAll = false } = options;
        const startAll = performance?.now ? performance.now() : Date.now();
        const results: Array<{ path: string; ok: boolean; status: number | null; latencyMs: number | null; error?: string }> = [];

        for (const ep of endpoints) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            const start = performance?.now ? performance.now() : Date.now();
            try {
                const resp = await fetch(`${this.BASE_URL}${ep.startsWith('/') ? ep : '/' + ep}`, { signal: controller.signal });
                clearTimeout(timer);
                const end = performance?.now ? performance.now() : Date.now();
                results.push({ path: ep, ok: resp.ok, status: resp.status, latencyMs: +(end - start).toFixed(1) });
            } catch (e: any) {
                clearTimeout(timer);
                const end = performance?.now ? performance.now() : Date.now();
                const aborted = e.name === 'AbortError';
                results.push({ path: ep, ok: false, status: null, latencyMs: +(end - start).toFixed(1), error: aborted ? 'timeout' : (e.message || 'erro') });
            }
        }

        const endAll = performance?.now ? performance.now() : Date.now();
        const totalLatencyMs = +(endAll - startAll).toFixed(1);
        const allOk = results.every(r => r.ok);
        const anyOk = results.some(r => r.ok);
        const ok = requireAll ? allOk : anyOk;
        let message: string;
        if (ok && allOk) message = 'Todos os endpoints OK';
        else if (ok && !allOk) message = 'Parcialmente OK (alguns endpoints falharam)';
        else message = 'API indisponível (nenhum endpoint respondeu)';

        return { ok, message, totalLatencyMs, endpoints: results };
    }
}