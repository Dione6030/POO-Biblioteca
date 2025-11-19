import Prompt from "prompt-sync";
import { Membro } from "./classes/Membro";
import { API } from "./servidor/API";
// Declaração mínima de process para evitar erro de tipos caso @types/node não esteja instalado.
declare const process: { exit(code?: number): void } | undefined;

const teclado = Prompt();

while (true) {
    console.log("+------------------Menu------------------+");
    console.log("|1. Opções de Membros                    |");
    console.log("|2. Opções de Livros                     |");
    console.log("|3. Opções de Empréstimos                |");
    console.log("|0. Sair                                 |");
    console.log("+----------------------------------------+");
    const escolha =+ teclado("Escolha uma opção: ");

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