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


    if (escolha === 0) {
        console.log("Saindo...");
        break;
    };

    switch (escolha) {
        case 1: {
            throw new Error("Not implemented yet: Membros");
        }
        case 2: {
            throw new Error("Not implemented yet: Livros");
        }
        case 3: {
            throw new Error("Not implemented yet: Empréstimos");
        }
        default: {
            console.log("Opção inválida!");
            break;
        };
    };
};