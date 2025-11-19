import Prompt from "prompt-sync";
import { Membro } from "./classes/Membro";
import { API } from "./servidor/API";
import { Livro } from "./classes/Livro";
import { Emprestimo } from "./classes/Emprestimo";

declare const process: { exit(code?: number): void } | undefined;

const teclado = Prompt();

async function verificarAPI(): Promise<void> {
    const check = await API.healthCheck({ requireAll: false });
    console.log(`HealthCheck: ${check.message} | Latência total: ${check.totalLatencyMs}ms`);
    for (const ep of check.endpoints) {
        const statusStr = ep.ok ? `OK (${ep.status})` : `FAIL ${ep.status ?? ''} ${ep.error ?? ''}`;
        console.log(` - ${ep.path.padEnd(18)} => ${statusStr.padEnd(18)} | ${ep.latencyMs}ms`);
    }
    if (!check.ok) {
        console.error('Alguns endpoints falharam ou todos indisponíveis.');
        console.log('Dicas: 1) Inicie: npm run dev:api  2) Verifique porta 3000  3) Conexão local liberada');
        const retry = teclado('Continuar mesmo assim? (s/N): ');
        if (retry.toLowerCase() !== 's') {
            if (process) process.exit(1);
            else throw new Error('Encerrado devido a falha de API');
        }
    }
}

async function menuPrincipal(): Promise<void> {
    await verificarAPI();
    while (true) {
        console.log("+------------------Menu------------------+");
        console.log("|1. Opções de Membros                    |");
        console.log("|2. Opções de Livros                     |");
        console.log("|3. Opções de Empréstimos                |");
        console.log("|0. Sair                                 |");
        console.log("+----------------------------------------+");
        const escolha = +teclado("Escolha uma opção: ");

        if (escolha === 0) {
            console.log("Saindo...");
            break;
        }

        switch (escolha) {
            case 1: {
                await menuMembros();
                break;
            }
            case 2: {
                await menuLivro();
                break;
            }
            case 3: {
                await menuEmprestimos();
                break;
            }
            default: {
                console.error("Opção inválida!");
                break;
            }
        }
    }
}

async function menuMembros(): Promise<void> {
    while (true) {
        console.log("+-----------Menu de Membros------------+");
        console.log("|1. Adicionar Membro                   |");
        console.log("|2. Atualizar Membro                   |");
        console.log("|3. Remover Membro                     |");
        console.log("|4. Listar Membros                     |");
        console.log("|0. Voltar ao Menu Principal           |");
        console.log("+--------------------------------------+");
        const escolhaMembro = +teclado("Escolha uma opção: ");

        if (escolhaMembro === 0) {
            console.log("Voltando ao menu principal...");
            break;
        }

        switch (escolhaMembro) {
            case 1: {
                await fluxoAdicionarMembro();
                break;
            }
            case 2: {
                await fluxoAtualizarMembro();
                break;
            }
            case 3: {
                await fluxoRemoverMembro();
                break;
            }
            case 4: {
                await imprimirMembros();
                break;
            }
            default: {
                console.error("Opção inválida!");
                break;
            }
        }
    }
}
async function fluxoAdicionarMembro(): Promise<void> {
    await verificarAPI();
    const nome = teclado("Nome: ");
    const numeroMatricula = teclado("Número de Matrícula: ");
    const endereco = teclado("Endereço: ");
    const telefone = teclado("Telefone: ");
    const novoMembro = new Membro(0, nome, numeroMatricula, endereco, telefone);
    try {
        const criado = await adicionarMembro(novoMembro);
        console.log("Membro adicionado com sucesso:", criado);
    } catch (e: any) {
        console.error("Erro ao adicionar membro:", e.message ?? e);
    }
}
async function imprimirMembros(): Promise<void> {
    const membros = await Membro.listarTodos();
    console.log("+-----------------------------------Lista de Membros-----------------------------------+");
    console.log("|id. |Nome................ |numeroMatricula.. |Endereço.............. |Telefone......... |");
    for (const m of membros) {
        console.log(`|${m.idPessoa.toString().padEnd(4)}|${m.nome.padEnd(20)}|${m.numeroMatricula.padEnd(17)}|${m.endereco.padEnd(22)}|${m.telefone.padEnd(17)}|`);
    }
    console.log("+-------------------------------------------------------------------------------------+");
}
async function fluxoAtualizarMembro(): Promise<void> {
    await verificarAPI();
    await imprimirMembros();
    const id = +teclado("ID do Membro a ser atualizado: ");
    try {
        const membro = await Membro.obterPorId(id);
        console.log("Pressione ENTER para manter o valor atual.");
        const novoNome = teclado(`Novo nome (${membro.nome}): `);
        if (novoNome.trim() !== "") membro.nome = novoNome;
        const novaMatricula = teclado(`Nova matrícula (${membro.numeroMatricula}): `);
        if (novaMatricula.trim() !== "") membro.numeroMatricula = novaMatricula;
        const novoEndereco = teclado(`Novo endereço (${membro.endereco}): `);
        if (novoEndereco.trim() !== "") membro.endereco = novoEndereco;
        const novoTelefone = teclado(`Novo telefone (${membro.telefone}): `);
        if (novoTelefone.trim() !== "") membro.telefone = novoTelefone;
        const atualizado = await atualizarMembro(membro);
        console.log("Membro atualizado:", atualizado);
    } catch (e: any) {
        console.error("Erro na atualização:", e.message ?? e);
    }
}
async function fluxoRemoverMembro(): Promise<void> {
    await verificarAPI();
    await imprimirMembros();
    const id = +teclado("ID do Membro a remover: ");
    try {
        const membro = await Membro.obterPorId(id);
        await membro.remover(id);
        console.log("Membro removido:", membro.idPessoa);
    } catch (e: any) {
        console.error("Erro ao remover:", e.message ?? e);
    }
}
async function adicionarMembro(membro: Membro): Promise<Membro> {
    return (await membro.adicionar(membro)) as Membro;
}
async function atualizarMembro(membro: Membro): Promise<Membro> {
    return (await membro.atualizar(membro)) as Membro;
}

async function menuLivro(): Promise<void> {
    while (true) {
        console.log("+-----------Menu de Livros------------+");
        console.log("|1. Adicionar Livro                   |");
        console.log("|2. Atualizar Livro                   |");
        console.log("|3. Remover Livro                     |");
        console.log("|4. Listar Livros                     |");
        console.log("|0. Voltar ao Menu Principal           |");
        console.log("+--------------------------------------+");
        const escolhaLivro = +teclado("Escolha uma opção: ");

        if (escolhaLivro === 0) {
            console.log("Voltando ao menu principal...");
            break;
        }

        switch (escolhaLivro) {
            case 1: {
                await fluxoAdicionarLivro();
                break;
            }
            case 2: {
                await fluxoAtualizarLivro();
                break;
            }
            case 3: {
                await fluxoRemoverLivro();
                break;
            }
            case 4: {
                await imprimirLivros();
                break;
            }
            default: {
                console.error("Opção inválida!");
                break;
            }
        }
    }
}
async function fluxoAdicionarLivro(): Promise<void> {
    await verificarAPI();
    const titulo = teclado("Título: ");
    const autor = teclado("Autor: ");
    const ISBN = teclado("ISBN: ");
    const anoPublicacao = new Date(teclado("Ano de Publicação: "));
    const novoLivro = new Livro(0, titulo, autor, ISBN, anoPublicacao);
    try {
        const criado = await adicionarLivro(novoLivro);
        console.log("Livro adicionado com sucesso:", criado);
    } catch (e: any) {
        console.error("Erro ao adicionar livro:", e.message ?? e);
    }
}
async function imprimirLivros(): Promise<void> {
    const livros = await Livro.listarTodos();
    console.log("+-----------------------------------Lista de livros-----------------------------------+");
    console.log("|id. |Titulo................ |Autor.............. |ISBN................. |Ano Publicação... |");
    for (const m of livros) {
        console.log(`|${m.idLivro.toString().padEnd(4)}|${m.titulo.padEnd(20)}|${m.autor.padEnd(20)}|${m.ISBN.padEnd(20)}|${(m.anoPublicacao?.toISOString().split('T')[0] ?? '').padEnd(17)}|`);
    }
    console.log("+-------------------------------------------------------------------------------------+");
}
async function fluxoAtualizarLivro(): Promise<void> {
    await verificarAPI();
    await imprimirLivros();
    const id = +teclado("ID do livro a ser atualizado: ");
    try {
        const livro = await Livro.obterPorId(id);
        console.log("Pressione ENTER para manter o valor atual.");
        const novoTitulo = teclado(`Novo Titulo (${livro.titulo}): `);
        if (novoTitulo.trim() !== "") livro.titulo = novoTitulo;
        const novoAutor = teclado(`Novo Autor (${livro.autor}): `);
        if (novoAutor.trim() !== "") livro.autor = novoAutor;
        const novoISBN = teclado(`Novo ISBN (${livro.ISBN}): `);
        if (novoISBN.trim() !== "") livro.ISBN = novoISBN;
        const novoAnoPublicacao = teclado(`Novo Ano de Publicação (${livro.anoPublicacao?.toISOString().split('T')[0] ?? ''}): `);
        if (novoAnoPublicacao.trim() !== "") livro.anoPublicacao = new Date(novoAnoPublicacao);
        const atualizado = await atualizarLivro(livro);
        console.log("livro atualizado:", atualizado);
    } catch (e: any) {
        console.error("Erro na atualização:", e.message ?? e);
    }
}
async function fluxoRemoverLivro(): Promise<void> {
    await verificarAPI();
    await imprimirLivros();
    const id = +teclado("ID do livro a remover: ");
    try {
        const livro = await Livro.obterPorId(id);
        await livro.remover(id);
        console.log("livro removido:", livro.idLivro);
    } catch (e: any) {
        console.error("Erro ao remover:", e.message ?? e);
    }
}
async function adicionarLivro(livro: Livro): Promise<Livro> {
    return (await livro.adicionar(livro)) as Livro;
}
async function atualizarLivro(livro: Livro): Promise<Livro> {
    return (await livro.atualizar(livro)) as Livro;
}


async function menuEmprestimos(): Promise<void> {
    while (true) {
        console.log("+-------- Menu de Empréstimos --------+");
        console.log("|1. Registrar Empréstimo             |");
        console.log("|2. Atualizar Empréstimo             |");
        console.log("|3. Remover Empréstimo               |");
        console.log("|4. Listar Empréstimos (todos)       |");
        console.log("|5. Listar Empréstimos Ativos        |");
        console.log("|0. Voltar                           |");
        console.log("+-------------------------------------+");
        const esc = +teclado("Escolha uma opção: ");
        if (esc === 0) break;
        switch (esc) {
            case 1: await fluxoRegistrarEmprestimo(); break;
            case 2: await fluxoAtualizarEmprestimo(); break;
            case 3: await fluxoRemoverEmprestimo(); break;
            case 4: await imprimirEmprestimos(false); break;
            case 5: await imprimirEmprestimos(true); break;
            default: console.error("Opção inválida!");
        }
    }
}



menuPrincipal().catch(err => {
    console.error("Falha fatal:", err);
});