---
key: "chrome-ai-context"
title: "IA integrada no Chrome: fazer o assistente lembrar-se da conversa anterior (com contexto)."
description: "[DESCONTINUADO] Desde uma atualização recente, existe um método melhor para tornar o assistente ciente do contexto. Consulte a documentação oficial."
date: 2024-03-25
tags: ["Chrome", "IA"]
cover: "/blog/ai-robot.webp"
image_credit: {
    text: "Fotografia de Alex Knight",
    url: "https://www.pexels.com/photo/high-angle-photo-of-robot-2599244/"
}
language: "pt-PT"
---

> Salte para "A solução" se estiver com pressa.

**[DESCONTINUADO] Desde uma atualização recente, existe um método melhor para tornar o assistente ciente do contexto. Consulte a documentação oficial.**

<middots>&middot; &middot; &middot;</middots>

Então, o Chrome lançou recentemente, para programadores e entusiastas, a nova versão integrada do Gemini na aplicação: um assistente offline que corre na sua máquina.

Para aceder a esta API, certifique-se de que está a utilizar uma versão do Chrome compatível (Canary ou Dev ≥ 128). As opções estão listadas para transferência abaixo:

- [canary (compilações noturnas)](https://www.google.com/chrome/canary/)
- [dev (para programadores)](https://www.google.com/chrome/dev/)

Assim que transferir uma delas, vá a **chrome://flags** (escreva isto na barra de endereço) e defina:

- **Enables optimization guide on device** como _Enabled BypassPerfRequirements_;
- **Prompt API for Gemini Nano** como _Enabled_

Depois disso, reinicie o Chrome. A seguir, abra-o novamente e vá a **chrome://components**

Aí deverá ver um componente chamado **Optimization Guide On Device Model**. Transfira-o. (cerca de 1,5 gigabytes, atenção a isso).

Se não aparecer, prima **f12** e vá à consola. Escreva:

```javascript
await window.ai.createTextSession()
```

e prima Enter. Deverá ver o **Optimization Guide On Device Model** surgir na lista de componentes.

Depois disso, reinicie o Chrome e, se estiver tudo correto, esta mensagem desaparece e já pode utilizar a IA.

<middots>&middot; &middot; &middot;</middots>

## Como preparar o básico

Antes de fazer a versão local do Gemini Nano lembrar-se da nossa conversa, tem de montar uma prova simples de que funciona. Cole isto na sua consola:

```javascript
const canCreate = await window.ai.canCreateTextSession();

if (canCreate !== "no") {
  const session = await window.ai.createTextSession();

  // Prompt the model and stream the result:
  const stream = session.promptStreaming("Write me an extra-long poem");
  for await (const chunk of stream) {
    console.log(chunk);
  }
}
```

![um fluxo de texto de uma IA generativa](https://cdn-images-1.medium.com/max/960/1*TPk6ZfvaB2mOCnaQM7KceA.png)
Deverá então ver isto a acontecer

\
O problema que vamos resolver é que, se perguntar à IA sobre a conversa anterior (mesmo dentro da mesma sessão), ela não lhe consegue responder. Não guarda o contexto.

Veja um exemplo na [aplicação da Vercel](https://ai-sdk-chrome-ai.vercel.app/):

![uma conversa com o Gemini que mostra que ele não suporta naturalmente a manutenção de contexto.](https://cdn-images-1.medium.com/max/960/1*RjyIQElvn5k7LunxoOSh2Q.png)
Acabou-se o Ed Sheeran, parece. Estava à espera de um rickroll, não estava?

\
Como pode reparar, esqueceu-se da tabela anterior e respondeu com uma nova saída do nada. Não é isto que queremos, por isso vamos corrigi-lo.

## Fazer o Gemini lembrar-se das nossas mensagens anteriores

### A investigação

Pode fornecer um contexto à IA integrada através do próprio prompt. Ao contrário de parâmetros como a temperatura e o top-k, que pode definir ao criar uma sessão, o contexto é fornecido a cada entrada do utilizador.

Existe uma **sequência de controlo especial** que nos permite fornecer o contexto. Na [documentação oficial](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit), esta sequência serve para ajudar o modelo a compreender rondas de interações simuladas, uma forma de o guiar até ao resultado pretendido.

![o exemplo da documentação](https://cdn-images-1.medium.com/max/960/1*6zbD5A4kkJS3OxZIIj0NBQ.png)
o exemplo da documentação

\
Como pode ver, há aqui pouca coisa sobre contexto.

Mas tive a intuição de que podíamos estender esta função e, com base na investigação que fiz sobre o funcionamento interno do Gemini, encontrei uma solução para obter comportamento com contexto no modelo.

### A solução

Em cada prompt, exceto no primeiro, vamos passar à função _prompt_ uma string formatada assim:

```typescript
`${allPreviousMessages} <ctrl23> ${currentPrompt}`
```

Basicamente, começamos o prompt com as mensagens anteriores separadas por quebras de linha, a **sequência de controlo especial** (que é literalmente só a string `<ctrl23>`, e não um símbolo U+seja-lá-o-quê sofisticado) e, por fim, o prompt atual propriamente dito. O resultado disso é uma IA ciente do seu contexto, como se segue:

![Este exemplo mostra a IA a reconhecer efetivamente as mensagens anteriores e a tê-las em conta para produzir uma nova resposta, ou seja, está ciente do contexto.](https://cdn-images-1.medium.com/max/960/1*ZiqeEMOkysKs3wxrBm0n_Q.png)
Agora já não perdemos o contexto anterior. Já agora, usar markdown nos textos do modelo é boa ideia!

\
Pode testá-lo você mesmo [aqui](https://dlgiovani.github.io/chrome-ai-webapp/).

Repare que precisa de limitar o tamanho do prompt para obter resultados ideais. Prompts na casa dos milhares de caracteres podem estragar o modelo.

Se está a pensar como é que os prompts ficam, aqui está o primeiro:

```
make a table with 2 songs and its artists
```

e aqui está o segundo:

```
make a table with 2 songs and its artists

 | Song Title | Artist |
|---|---|
| "Strawberry Fields Forever" | The Beatles |
| "Born This Way" | Lady Gaga |

     <ctrl23>
add a nirvana song to this table
```

E com um terceiro prompt, passaria a ser:

```
make a table with 2 songs and its artists

 | Song Title | Artist |
|---|---|
| "Strawberry Fields Forever" | The Beatles |
| "Born This Way" | Lady Gaga |


add a nirvana song to this table

 | Song Title | Artist |
|---|---|
| "Strawberry Fields Forever" | The Beatles |
| "Born This Way" | Lady Gaga |
| "Smells Like Teen Spirit" | Nirvana |

     <ctrl23>
What are the four seasons?
```

Vamos aumentando este prompt até ao limite de 4096 caracteres, conforme a documentação. Pessoalmente, não recomendaria mais de 1000. Um poema com 2552 caracteres estragou o modelo e foi um bocado chato pô-lo a funcionar outra vez. Isto também pode ser culpa do meu portátil velho, claro.

## E é tudo, pessoal!

Pode ver o repositório da versão com contexto [nesta ligação](https://github.com/dlgiovani/chrome-ai-webapp/tree/main). Deixe uma estrela 🌟 no repositório se gostou!

<middots>&middot; &middot; &middot;</middots>

aplicação do chrome feita por mim: https://dlgiovani.github.io/chrome-ai-webapp/ \
aplicação da vercel: https://ai-sdk-chrome-ai.vercel.app/ \
repositório da minha aplicação no github: https://github.com/dlgiovani/chrome-ai-webapp/tree/main
