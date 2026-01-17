# 📸 Project ReactGram API

API REST para uma rede social de compartilhamento de fotos.

---

## 🚀 Funcionalidades

- Autenticação segura com JWT armazenado em HTTP-Only Cookies
- Atualização de perfil e imagem
- Upload de fotos
- Listagem e busca de fotos
- Curtidas e comentários
- Exclusão de fotos pelo dono
- Armazenamento de imagem via Cloudinary.

---

## 🛠️ Tecnologias

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT
- Multer
- Swagger (OpenAPI)
- Express Validator
- Cloudinary

---

## ⚙️ Setup

### Instalação

- git clone https://github.com/capela-joao/project-reactgram-backend.git

- cd project-reactgram-backend
- npm install


### Variáveis de ambiente (`.env`)

- PORT=5001
- MONGO_URI=sua_string_mongo_db
- JWT_TOKEN=thisisoursecret


### Executar

- npm run dev


API: `http://localhost:5001`  
Swagger: `http://localhost:5001/api-docs`
