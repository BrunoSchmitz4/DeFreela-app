# DeFreela - Front-end
O DeFreela é uma plataforma inovadora projetada para simplificar a colaboração entre profissionais freelancers e empresas. Nosso objetivo é facilitar a criação e a gestão de contratos de trabalho de forma segura e eficiente, garantindo transparência e agilidade para ambas as partes. Este repositório contém a aplicação Front-end do projeto.

**🚀 Tecnologias e Ferramentas**
- React JS: Biblioteca JavaScript para a construção de interfaces de usuário reativas.
- React Router DOM: Gerenciador de rotas para navegação entre as páginas da aplicação.
- React MEMO: Técnica de otimização de performance que evita renderizações desnecessárias de componentes.
- Animate.CSS: Biblioteca de animações que adiciona transições e efeitos visuais atraentes à interface.
- Axios: Cliente HTTP baseado em Promisses, utilizado para comunicação com a API REST do Back-end.
- JSX: Uma extensão de sintaxe do JavaScript que permite escrever código HTML dentro dos arquivos JS.

### Arquitetura
- Estrutura modular baseada em componentes (Atomic-like)  
- Hooks customizados  
- Mocks simulando a API  
- Pastas separadas por responsabilidade  
- Base preparada para escalabilidade futura  


### Detalhes importantes
- Todo usuário é **freelancer e contratante** ao mesmo tempo.  
- O perfil é universal e acessível via **/profile/:id**.  
- MyProjects e MyJobs são independentes.  
- ProjectDetails substitui o antigo /contracts.  

---

### Fluxo de Interação do Usuário
Usuário Contratante
- Criar projeto
- Editar projeto
- Cancelar/excluir projeto
- Buscar freelancers
- Acessar perfis

Usuário Freelancer
- Buscar projetos
- Marcar/desmarcar interesse
- Gerenciar trabalhos
- Acessar perfis

Ambos
- Possuem página de perfil com abas
- Projetos criados e trabalhos aceitos
- Detalhes de projetos acessíveis via cards

---

## 🧠 Estado Atual

- ✔ Estrutura modular completa  
- ✔ Hooks e contexts funcionando  
- ✔ Simulação com mocks realistas  
- ✔ Páginas e subpáginas implementadas  
- ✔ Preparado para integração com a API  

### Próximos passos
- Autenticação real  
- Rotas privadas  
- Integração total com Spring Boot  
- Edição de perfil  
- Persistência real de interesse em projetos  

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js  
- NPM ou Yarn  

### Instalação

```bash
git clone https://github.com/BrunoSchmitz4/DeFreela-app.git
cd DeFreela-app
npm install

---

**## 🛠️ Como Executar o Projeto**

### Pré-requisitos
- Node.js  
- NPM ou Yarn  

### Instalação

```bash
git clone https://github.com/BrunoSchmitz4/DeFreela-app.git
cd DeFreela-app
npm install
 ou
`yarn install`

Crie um arquivo .env na raiz do projeto e configure a URL da API do Back-end (substitua pelo endereço correto da sua API):

REACT_APP_API_URL=http://localhost:3001/api

**Rodando a Aplicação**

Inicie o servidor de desenvolvimento:
> Bash
`npm start `
 ou
`yarn start `

> A aplicação será executada em http://localhost:3000 e recarregará automaticamente a cada alteração.


**📝 Licença**
> Distribuído sob a licença MIT. Veja o arquivo LICENSE para mais informações.
