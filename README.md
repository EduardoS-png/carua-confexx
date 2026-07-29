# Caruá Tecido

Desenvolva um MVP (Produto Mínimo Viável) para uma plataforma web chamada Caruá Confex, com foco principal na gestão de produção e controle de processos no setor têxtil, especialmente voltada para facções e pequenas confecções. O sistema deve priorizar a organização operacional, substituindo métodos informais (como cadernos e anotações manuais) por um ambiente digital simples, funcional e eficiente.

A solução deve ser estruturada em três camadas principais:
(1) uma landing page institucional,
(2) um sistema interno de gestão produtiva (núcleo),
e (3) um marketplace de profissionais com portfólios digitais.

A landing page deve apresentar a proposta da plataforma de forma clara, objetiva e estratégica, com foco em conversão. Deve conter seções como:

 Hero section com proposta de valor clara (ex: organização da produção têxtil e aumento da eficiência);

 Explicação do problema (desorganização, perdas, falta de controle);

 Apresentação da solução (gestão produtiva simples e eficiente);

 Benefícios principais (redução de perdas, controle de produção, mais organização);

 Demonstração visual do sistema (mockups ou ilustrações);

 Seção sobre como funciona (passo a passo simplificado);

 Chamada para ação (ex: “Começar agora” ou “Testar gratuitamente”).

Essa página deve ser visualmente atrativa, mas mantendo simplicidade e clareza, com foco em comunicar valor rapidamente.

O núcleo do sistema deve ser um dashboard de gestão produtiva, permitindo o registro e acompanhamento de pedidos (lotes), divisão de tarefas entre profissionais e visualização do status de cada etapa da produção (como corte, costura e acabamento). O fluxo produtivo deve ser estruturado de forma clara e sequencial, possibilitando ao usuário saber exatamente em que etapa cada peça ou lote se encontra, reduzindo atrasos, retrabalho e desorganização.

Inclua também um módulo de controle de materiais, no qual seja possível registrar entrada e saída de insumos, vincular materiais a pedidos específicos e identificar possíveis perdas ou inconsistências. Esse controle deve ser direto e funcional, com foco em rastreabilidade e redução de desperdícios.

O sistema deve conter uma funcionalidade básica de gestão financeira, permitindo calcular automaticamente pagamentos por produção (por peça ou lote), registrar valores e acompanhar ganhos e custos. O objetivo é garantir clareza e transparência, não complexidade financeira.

Adicione um módulo de gestão de profissionais, permitindo cadastrar trabalhadores, atribuir tarefas e acompanhar sua participação na produção. Esse controle deve permitir identificar quem executou cada etapa do processo produtivo.

O sistema deve incluir também um marketplace simples de profissionais, integrado à plataforma, onde:

 Profissionais podem criar perfis públicos;

 Cada perfil deve funcionar como um portfólio digital, contendo:

 Nome e especialidade;

 Tipos de serviço (ex: bainha, ajustes, produção em lote);

 Preço base ou faixa de valores;

 Prazo médio de entrega;

 Fotos de trabalhos realizados;

 Esses perfis devem ser listados em uma página de exploração simples;

 O objetivo do marketplace não é ser complexo, mas sim validar a possibilidade de dar visibilidade aos profissionais e expandir a operação.

A interface deve seguir princípios de UX simples, intuitiva e acessível, considerando usuários com baixo nível de familiaridade tecnológica. A navegação deve ser clara, com menus objetivos, botões evidentes e layout limpo. O sistema deve ser totalmente responsivo, funcionando bem tanto em desktop quanto em dispositivos móveis.

Utilize a tipografia INTER + POPPINS, aplicando:

Poppins para títulos e destaques;

Inter para textos, conteúdos e interfaces.

A identidade visual deve utilizar a seguinte paleta de cores, e tambem trazer uma indentidade cultural da regial e elementos texteis nas telas,  respeitando o conceito 60-30-10:

#FFF7ED → fundo principal

#F5E1D3 → superfícies secundárias (cards, containers)

#9A3412 → cor primária (botões principais)

#EA580C → cor de destaque (ações e estados ativos)

#2D1B12 → textos e elementos de alto contraste

O visual deve transmitir proximidade, identidade regional e profissionalismo, sem excesso de complexidade.

Não é necessário implementar autenticação avançada neste momento, podendo ser utilizado um login simples ou simulado.

O objetivo do MVP não é ser completo, mas validar os principais fluxos:

 Criação e acompanhamento de pedidos;

 Distribuição de tarefas;

 Controle básico de materiais;

 Registro de produção e pagamentos;

 Visualização de perfis profissionais (portfólio digital).

Evite funcionalidades secundárias ou complexas. O foco deve estar na resolução do problema central: falta de controle da produção e desorganização dos processos no setor têxtil.

O resultado esperado é um sistema funcional, simples e validável, que demonstre claramente como a digitalização da gestão produtiva pode reduzir perdas, melhorar a organização e aumentar a eficiência — ao mesmo tempo em que abre espaço para visibilidade dos profissionais por meio do marketplace.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://carua-confexx.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bd577fb2-10c7-468b-9300-be5e8d878a47).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
