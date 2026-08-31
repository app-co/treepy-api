# Endpoints e Tipagens da API

Abaixo está o mapeamento das requisições (GET, POST, PUT, DELETE) e os respectivos objetos de envio, parâmetros e tipagens extraídos dos módulos do projeto Fastify.

---

## 🧮 Módulo: Calculadora
**Autenticação:** Obrigatória (`verify-jwt`)

### `GET /calculadora/byUserId`
- **Body / Params:** N/A

### `GET /calculadora`
- **Body / Params:** N/A

### `POST /calculadora/register`
- **Body:**
```typescript
{
  gas: number;
  eletricidade: number;
  transporte_individual: number;
  transporte_coletivo: number;
  alimentacao: number;
  residuos: number;
  userId: string;
}
```

---

## 🌳 Módulo: Florestas
**Autenticação:** Obrigatória (`verify-jwt`) | **Role:** Admin `roles(0)`

### `POST /florestas/register`
- **Body:**
```typescript
{
  nome: string;
  codigo: string;
  lat: string;
  long: string;
  qnt_arvores: number;
  treepycash_disponivel: number;
  projeto: number;
  status: number;
}
```

### `GET /florestas/byProjeto`
- **Params / Query:**
```typescript
{
  projeto: string | number;
}
```

### `GET /florestas`
- **Body / Params:** N/A

### `DELETE /florestas/delete`
- **Query:** `projeto: string | number`

---

## 📜 Módulo: Histórico
**Autenticação:** Obrigatória (`verify-jwt`)

### `POST /historico/register`
- **Body:** `any` (tipagem não definida no schema de entrada)

### `GET /historico-user`
- **Body / Params:** N/A

---

## 🌱 Módulo: Lead ESG
**Autenticação:** Não definida na rota

### `POST /lead/esg`
- **Body:**
```typescript
{
  nomeCompleto: string;
  emailCorporativo: string;
  cargoFuncao: string;
  nomeEmpresa: string;
  industria: 'TECNOLOGIA_SAAS' | 'AGRONEGOCIO' | 'INDUSTRIA' | 'FINANCEIRO' | 'VAREJO' | 'SAUDE' | 'EDUCACAO' | 'ENERGIA' | 'LOGISTICA' | 'OUTROS';
  tamanhoEmpresa: 'ATE_100' | 'DE_101_A_500' | 'DE_501_A_2000' | 'ACIMA_2000';
  reflorestamentoNativo: boolean; // default: false
  neutralizacaoCO2: boolean; // default: false
  biodiversidadeAuditada: boolean; // default: false
  objetivosEstrategicos?: string;
}
```

---

## 📊 Módulo: Métricas
**Autenticação:** Obrigatória (`verify-jwt`)

### `GET /metricas/user`
- **Body / Params:** N/A

### `GET /metricas/admin`
- **Autenticação:** Obrigatória + Role Admin `roles(0)`
- **Body / Params:** N/A

### `GET /metricas/dash-user`
- **Query:** 
```typescript
{
  ano: string;
}
```

---

## 💳 Módulo: Pagamento (Payment)
**Autenticação:** Não definida diretamente na rota index

### `GET /payment/register`
- **Body:** `any` (Lê os dados para configuração do Webhook)

### `GET /listar`
- **Body / Params:** N/A

### `DELETE /deletar/:id`
- **Params:** 
```typescript
{
  id: string;
}
```

### `PUT /atualizar/:id`
- **Params:** 
```typescript
{
  id: string;
}
```

---

## 💲 Módulo: Precificação
**Autenticação:** Obrigatória (`verify-jwt`)

### `GET /precificacao`
- **Body / Params:** N/A

### `PUT /precificacao`
- **Body:**
```typescript
{
  price: number;
}
```

---

## 💸 Módulo: Transação (Transaction)
**Autenticação:** Obrigatória (`verify-jwt`) - *exceto para a rota de webhook*

### `POST /transaction-card`
- **Body:**
```typescript
{
  value: number;
  cardNumber: string;
  cvv: string;
  expiryYear: string;
  expiryMonth: string;
  userId: string;
  holderName: string;
  history?: boolean; // default: false
  installmentCount?: number; // default: 1
  installmentValue: number;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  phone: string;
}
```

### `POST /transaction-pix`
- **Body:**
```typescript
{
  value: number;
  userId: string;
}
```

### `POST /transaction-boleto`
- **Body:** `any` (Schema *boleto* não presente no dtos/schemas exportados)

### `POST /webhook` (App Transaction)
- **Autenticação:** Nenhuma
- **Body:** `any` (Dados recebidos do provedor de pagamento)

---

## 📤 Módulo: Upload
**Autenticação:** Obrigatória (`verify-jwt`)

### `POST /upload`
- **Body:** Recebe multipart/form-data contento o arquivo (ex: `req.file()`).

---

## 👤 Módulo: Usuário (User)
### 🔓 Rotas Públicas (Sem autenticação)

#### `GET /`
- **Ação:** Checagem de acesso

#### `POST /user`
- **Body:**
```typescript
{
  nome: string;
  email: string;
  senha: string;
  cpfCnpj?: string;
  photoUrl?: string;
}
```

#### `POST /login`
- **Body:**
```typescript
{
  email: string;
  senha: string;
}
```

#### `PATCH /refresh-token`
- **Cookies Requerido:** `refresh`

#### `POST /mail/forgot-pass`
- **Body:**
```typescript
{
  email: string;
}
```

#### `POST /reset-pass`
- **Body:**
```typescript
{
  token: string;
  pas: string; // Senha nova
}
```

#### `GET /reset-cashe`

---
### 🔒 Rotas Autenticadas (`verify-jwt`)

#### `GET /user`
- **Ação:** Retorna o usuário logado via `req.user.sub`

#### `GET /allUsers`

#### `POST /add-treepycashe`
- **Body:**
```typescript
{
  userId: string;
  treepycashe: number;
  florestaId: number;
}
```

#### `POST /user/endereco`
- **Body:**
```typescript
{
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  pais: string;
  numero: string;
  userId: string;
  rua: string;
}
```

#### `PUT /user`
- **Body:**
```typescript
{
  id: string; // Obtido pelo req.user.sub, mas avaliado no Zod
  nome: string;
  email: string;
  senha?: string;
  photoUrl?: string;
  cpfCnpj: string;
}
```
