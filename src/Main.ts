import Prompt from "prompt-sync";
import { Membro } from "./classes/Membro";
import { API } from "./servidor/API";
// Declaração mínima de process para evitar erro de tipos caso @types/node não esteja instalado.
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
                console.log("Funcionalidade de Livros ainda não implementada.");
                break;
            }
            case 3: {
                console.log("Funcionalidade de Empréstimos ainda não implementada.");
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

menuPrincipal().catch(err => {
    console.error("Falha fatal:", err);
});