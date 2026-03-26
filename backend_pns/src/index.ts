import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE DE SEGURANÇA ---
const verificarToken = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Faça login primeiro." });
  }

  try {
    const dadosVerificados = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.usuarioLogado = dadosVerificados; 
    next();
  } catch (err) {
    res.status(403).json({ erro: "Token inválido ou expirado." });
  }
};

// --- ROTAS DE AUTENTICAÇÃO ---

// Login
app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const admin = await prisma.admins.findUnique({ where: { email } });

    if (!admin || !admin.senha) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: admin.id, nivel: admin.nivel },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // Retorna se o usuário precisa mudar a senha
    res.json({ 
      token, 
      nome: admin.nome, 
      nivel: admin.nivel,
      mudar_senha: admin.mudar_senha 
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// Define o padrão: Mínimo 6 caracteres, 1 Maiúscula, 1 Número e 1 Especial
const senhaForteRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+={}\[\]:;<>|./?-]).{6,}$/;

// --- ROTA DE ATUALIZAÇÃO (Onde o usuário muda a senha dele) ---
app.put('/auth/atualizar-senha', verificarToken, async (req: any, res: Response) => {
  try {
    const { novaSenha } = req.body;
    const userId = req.usuarioLogado.id;

    // VALIDACÃO CRUCIAL AQUI
    if (!senhaForteRegex.test(novaSenha)) {
      return res.status(400).json({ 
        erro: "Senha fraca! Use pelo menos 6 caracteres, uma letra maiúscula, um número e um caractere especial." 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    await prisma.admins.update({
      where: { id: Number(userId) }, // Garanta que o ID seja um número
      data: {
        senha: senhaHash,
        mudar_senha: false
      }
    });

    res.json({ mensagem: "Senha atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar senha." });
  }
});

// --- GESTÃO DE USUÁRIOS (ADMINS) ---

// Listar Admins (Apenas Super Admin)
app.get('/admins', verificarToken, async (req: any, res: Response) => {
  try {
    if (req.usuarioLogado.nivel !== 'super_administrador') {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    const todosAdmins = await prisma.admins.findMany({
      select: { id: true, nome: true, email: true, nivel: true, mudar_senha: true, created_at: true }
    });
    res.json(todosAdmins);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar administradores." });
  }
});

// Cadastrar Novo Admin com Senha Genérica
app.post('/admins', verificarToken, async (req: any, res: Response) => {
  try {
    const { nome, email, nivel } = req.body;

    if (req.usuarioLogado.nivel !== 'super_administrador') {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    const existe = await prisma.admins.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ erro: "E-mail já cadastrado." });

    const senhaGenerica = "Mudar@123";
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senhaGenerica, salt);

    const novo = await prisma.admins.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        nivel: nivel || "administrador",
        mudar_senha: true
      }
    });

    res.status(201).json({ 
      mensagem: "Admin cadastrado!", 
      senha_temporaria: senhaGenerica,
      id: novo.id 
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar administrador." });
  }
});

// Deletar Admin
app.delete('/admins/:id', verificarToken, async (req: any, res: Response) => {
  try {
    if (req.usuarioLogado.nivel !== 'super_administrador') {
      return res.status(403).json({ erro: "Acesso negado." });
    }
    await prisma.admins.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: "Administrador removido!" });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao remover administrador." });
  }
});

// --- GESTÃO DE SUBSTÂNCIAS ---

app.post('/substances', verificarToken, async (req: any, res: Response) => {
  try {
    const data = req.body;
    const nova = await prisma.substances.create({ data });
    res.status(201).json(nova);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao cadastrar substância.' });
  }
});

app.put('/substances/:id', verificarToken, async (req: any, res: Response) => {
  try {
    const atualizada = await prisma.substances.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(atualizada);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar." });
  }
});

app.delete('/substances/:id', verificarToken, async (req: any, res: Response) => {
  try {
    await prisma.substances.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: "Removida!" });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao remover." });
  }
});

// --- ROTAS PÚBLICAS ---

app.get('/public/substances', async (req, res) => {
  const todas = await prisma.substances.findMany({ orderBy: { nome: 'asc' } });
  res.json(todas);
});

app.get('/public/substances/:id', async (req, res) => {
  const sub = await prisma.substances.findUnique({ where: { id: Number(req.params.id) } });
  sub ? res.json(sub) : res.status(404).json({ erro: "Não encontrada." });
});

app.get('/public/substances/suggestions', async (req: Request, res: Response) => {
  const { termo } = req.query;
  const busca = String(termo || "").trim();
  if (!busca) return res.json([]);

  const resultados = await prisma.substances.findMany({
    where: {
      OR: [
        { nome: { contains: busca, mode: 'insensitive' } },
        { nome_quimico: { contains: busca, mode: 'insensitive' } },
        { origem: { contains: busca, mode: 'insensitive' } },
      ]
    },
    take: 10
  });
  res.json(resultados);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});