import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('suasenha123', 10);

  await prisma.admins.upsert({
    where: { email: 'thayfigueiredo2003@gmail.com' },
    update: {},
    create: {
      nome: 'Thayla Almeida',
      email: 'thayfigueiredo2003@gmail.com',
      senha: await bcrypt.hash('thayla2003', 10),
      nivel: 'super_administrador'
    },
  });

  console.log('✅ Primeiro Super Admin criado com sucesso!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());