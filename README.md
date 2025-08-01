# 🎯 Leilão Virtual - Direito de Viver

Este é o sistema **Leilão Virtual Direito de Viver**, desenvolvido para apoiar o evento beneficente em prol do **Hospital de Amor de Nova Andradina - MS**. O projeto visa facilitar a exibição, lances e gerenciamento de produtos do leilão de forma prática e acessível, tanto para participantes quanto para administradores do evento.

---

## 🚀 Finalidade do Projeto

A plataforma tem como objetivo proporcionar uma experiência moderna e eficiente para o **Leilão Direito de Viver**, com foco em:

- Facilitar a navegação e visualização dos produtos leiloados;
- Tornar acessível a participação de qualquer pessoa via dispositivos conectados;
- Oferecer uma área administrativa completa para gestão e acompanhamento dos lances.

---

## 🧰 Requisitos

- Node.js (versão 18 ou superior)
- Yarn ou npm
- Backend Ruby on Rails disponível na porta 3000 (API e WebSocket)
- `.env` com variáveis de ambiente corretamente definidas (veja abaixo)

---

## ⚙️ Instalação e Execução Local

1. **Clone o repositório:**

```bash
git clone https://github.com/jemisson/leilao.git
cd leilao
```

2. **Instale as dependências:**


```bash
npm install
```


3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AUTH_API_BASE_URL=http://localhost:3000
VITE_WEBSOCKET_URL=ws://localhost:3000/cable
```

4. **Execute o projeto em modo desenvolvimento:**

```bash
npm run dev
```

A aplicação estará acessível em: [http://localhost:5173](http://localhost:5173)

---

## ✨ Funcionalidades

### 🛍️ Para Participantes
- ✅ Catálogo de produtos leiloados;
- ✅ Compartilhamento de produtos via redes sociais ou link direto;

### 🛠️ Para Administradores
- ✅ Dashboard com estatísticas gerais do evento;
- ✅ Listagem e gerenciamento de produtos (duplicar, editar, visualizar, finalizar/arrematar);
- ✅ Detalhamento de lances por produto;
- ✅ Listagem de participantes cadastrados;
- ✅ Listagem de lances por participante.

---

## 📦 Scripts disponíveis

- `dev`: inicia o servidor local com Vite;
- `start`: inicia a prévia de produção na porta 3001;
- `build`: compila o projeto para produção;
- `lint`: verifica problemas de código com ESLint.

---

## 🧪 Stack Utilizada

- **React 18 + TypeScript**
- **Tailwind CSS + Flowbite**
- **Axios + ActionCable**
- **Recharts, React Router DOM, React Toastify**
- **Vite como bundler**

---

## 🤝 Apoie o Hospital de Amor

Este sistema foi desenvolvido com ❤️ e carinho por voluntários e profissionais para apoiar uma causa nobre. Todo envolvimento e divulgação é bem-vindo!
