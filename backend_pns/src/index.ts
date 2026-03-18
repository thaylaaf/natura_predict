

import bcrypt from 'bcrypt';
// Importa o "dotenv" para carregar o .env
import jwt from 'jsonwebtoken';
///importa o token
import * as dotenv from 'dotenv';
dotenv.config(); // Isso "lê" o seu .env e o prepara

// Importa o Express e os tipos (Request, Response)
import express, { Request, Response } from 'express';

import cors from 'cors';

const app = express();
app.use(cors()); // <--- ESSA LINHA É OBRIGATÓRIA
app.use(express.json());

// Importa o PrismaClient
import { PrismaClient } from '@prisma/client';

// Volte para o modo simples
const prisma = new PrismaClient();
const port = 3000;

// Configura o Express para "entender" JSON
app.use(express.json());

// Manda o servidor "ligar"
app.listen(port, () => {
  console.log(`Servidor TS rodando em http://localhost:${port}`);
});

// Rota de Login: A "recepção" do seu prédio
app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    // 1. Procura o administrador pelo e-mail
    const admin = await prisma.admins.findUnique({ where: { email } });

    // 2. Se não achar o e-mail ou a senha estiver errada
    if (!admin) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    // 3. Verifica se a senha bate com o que está no banco
    // Mude a linha 48 para isso:
    if (!admin || !admin.senha) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    // 4. Cria o "Crachá Digital" (Token) assinado com sua Chave Secreta
    const token = jwt.sign(
      { id: admin.id, nivel: admin.nivel }, // Informações salvas dentro do token
      process.env.JWT_SECRET as string,     // Sua chave do .env
      { expiresIn: '1d' }                   // O token expira em 1 dia
    );

    // 5. Devolve o token para o usuário
    res.json({ token, nome: admin.nome, nivel: admin.nivel });
  } catch (error) {
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// Middleware: O "Segurança" que verifica o crachá
const verificarToken = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Pega o token do cabeçalho

  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Faça login primeiro." });
  }

  try {
    // Verifica se o token foi assinado com a nossa chave secreta
    const dadosVerificados = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    // Salva os dados do usuário dentro da requisição para as próximas funções usarem
    req.usuarioLogado = dadosVerificados; 
    
    next(); // "Pode passar!"
  } catch (err) {
    res.status(403).json({ erro: "Token inválido ou expirado." });
  }
};

// rota de cadastro de substancia 
app.post('/substances', verificarToken, async (req: any, res: Response) => {
  try {
    // 1. Pegamos exatamente os campos que aparecem no seu pgAdmin
    const { 
      nome, 
      nome_quimico, 
      formula_molecular, 
      smile, 
      propriedades_farmacologicas, 
      origem, 
      uso_tradicional 
    } = req.body;

    // NOVA VALIDAÇÃO: Verifica se algum campo está faltando ou vazio
    if (!nome || !nome_quimico || !formula_molecular || !smile || 
        !propriedades_farmacologicas || !origem || !uso_tradicional) {
      
      return res.status(400).json({ 
        erro: "Todos os campos devem ser preenchidos." 
      });
    }

    // 2. Criamos no banco usando o Prisma
    const novaSubstancia = await prisma.substances.create({
      data: {
        nome,
        nome_quimico,
        formula_molecular,
        smile,
        propriedades_farmacologicas,
        origem,
        uso_tradicional
      },
    });

    res.status(201).json(novaSubstancia);
  } catch (error) {
    console.error(error);
    res.status(400).json({ erro: 'Falha ao cadastrar substância. Verifique os campos enviados.' });
  }
});

// Rota para editar substância: usa o ID na URL e o Token para segurança
app.put('/substances/:id', verificarToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params; // Pega o ID da planta (ex: 3 para o Guaco)
    
    // Pegamos os campos que podem ser editados
    const { 
      nome, 
      nome_quimico, 
      formula_molecular, 
      smile, 
      propriedades_farmacologicas, 
      origem, 
      uso_tradicional 
    } = req.body;

    // Atualizamos no banco de dados usando o Prisma
    const substanciaAtualizada = await prisma.substances.update({
      where: { id: Number(id) },
      data: {
        nome,
        nome_quimico,
        formula_molecular,
        smile,
        propriedades_farmacologicas,
        origem,
        uso_tradicional
      },
    });

    res.json({ mensagem: "Substância atualizada com sucesso!", dados: substanciaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(400).json({ erro: "Erro ao atualizar. Verifique se o ID existe ou se os campos estão corretos." });
  }
});

// Rota para deletar: usa o ID da URL e o Token de quem está logado
app.delete('/substances/:id', verificarToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params; // Pega o "1" da URL /substances/1

    await prisma.substances.delete({
      where: { id: Number(id) },
    });

    res.json({ mensagem: "Substância removida com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ erro: "Erro ao remover substância. Verifique se o ID existe." });
  }
});

//rota para cadastro de administrador, só o super admin faz
app.post('/admins', verificarToken, async (req: any, res: Response) => {
  try {
    // 1. Não pegamos mais o idDoSolicitante do body!
    const { nome, email, senha, nivel } = req.body;

    // 2. Trava de segurança: Usamos o nível que veio direto do crachá (Token)
    if (req.usuarioLogado.nivel !== 'super_administrador') {
      return res.status(403).json({ erro: "Acesso negado. Apenas super_admins criam usuários." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoAdmin = await prisma.admins.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        nivel: nivel || "administrador"
      },
    });

    const { senha: _, ...adminSemSenha } = novoAdmin;
    res.status(201).json(adminSemSenha);

  } catch (error) {
    res.status(400).json({ erro: 'Falha ao cadastrar administrador.' });
  }
});

// Rota para remover um administrador (Apenas super_administrador)
app.delete('/admins/:id', verificarToken, async (req: any, res: Response) => {
  try {
    // 🛡️ Trava de segurança: só super_administrador deleta pessoas
    if (req.usuarioLogado.nivel !== 'super_administrador') {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    const { id } = req.params;
    await prisma.admins.delete({ where: { id: Number(id) } });

    res.json({ mensagem: "Administrador removido!" });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao remover administrador." });
  }
});



// rota para listar todos os administradores para gerenciamento
app.get('/admins', verificarToken, async (req: any, res: Response) => {
  try {
    // Opcional: Você pode travar para que só o super_admin veja a lista completa
    if (req.usuarioLogado.nivel !== 'super_administrador') {
      return res.status(403).json({ erro: "Apenas super_admins podem listar usuários." });
    }

    const todosAdmins = await prisma.admins.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        nivel: true, // Adicionado para você saber quem é quem
        created_at: true,
      }
    });

    res.json(todosAdmins);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar administradores." });
  }
});

// 🔍 ROTA DE BUSCA GLOBAL ATUALIZADA
app.get('/public/substances/suggestions', async (req: Request, res: Response) => {
  try {
    const { termo } = req.query;

    if (!termo) {
      return res.json([]);
    }

    // 1. O .trim() remove espaços inúteis no início e no fim (ex: " Cerrado " -> "Cerrado")
    // 2. Mantemos o espaço interno para que frases como "Cerrado Brasileiro" funcionem
    const busca = String(termo).trim();
    if (busca.length === 0) {
      return res.json([]);
    }

    const resultados = await prisma.substances.findMany({
      where: {
        OR: [
          { nome: { contains: busca, mode: 'insensitive' } },
          { nome_quimico: { contains: busca, mode: 'insensitive' } },
          { formula_molecular: { contains: busca, mode: 'insensitive' } },
          { smile: { contains: busca, mode: 'insensitive' } },
          { propriedades_farmacologicas: { contains: busca, mode: 'insensitive' } },
          { origem: { contains: busca, mode: 'insensitive' } },
          { uso_tradicional: { contains: busca, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        nome: true,
        origem: true,
        propriedades_farmacologicas: true 
      },
      take: 10
    });

    res.json(resultados);
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ erro: "Erro ao realizar busca." });
  }
});

// 📄 ROTA 2: Ficha Técnica (O que aparece quando o usuário clica em uma planta)
app.get('/public/substances/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const substancia = await prisma.substances.findUnique({
      where: { id: Number(id) }
    });

    if (!substancia) {
      return res.status(404).json({ erro: "Substância não encontrada." });
    }

    // Retorna todos os dados obrigatórios que você configurou
    res.json(substancia);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar detalhes." });
  }
});

// 📚 ROTA 3: Catálogo Geral (Para listar tudo na página inicial do site)
app.get('/public/substances', async (req: Request, res: Response) => {
  try {
    const todas = await prisma.substances.findMany({
      orderBy: { nome: 'asc' } // Organiza de A a Z
    });
    res.json(todas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar PNs." });
  }
});