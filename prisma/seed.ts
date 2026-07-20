import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Configure it in your environment.',
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const SEED_PROFESSOR_EMAIL =
  process.env.SEED_PROFESSOR_EMAIL || 'professor@fiap.com';
const SEED_PROFESSOR_PASSWORD =
  process.env.SEED_PROFESSOR_PASSWORD || 'professor123';
const SEED_PROFESSOR_NAME =
  process.env.SEED_PROFESSOR_NAME || 'Professor Padrão';

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: SEED_PROFESSOR_EMAIL },
  });

  if (existing) {
    console.log(
      `Seed: professor "${SEED_PROFESSOR_EMAIL}" já existe, nada a fazer.`,
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(SEED_PROFESSOR_PASSWORD, 10);

  await prisma.user.create({
    data: {
      email: SEED_PROFESSOR_EMAIL,
      password: hashedPassword,
      name: SEED_PROFESSOR_NAME,
      role: 'PROFESSOR',
    },
  });

  console.log('Seed: professor inicial criado com sucesso.');
  console.log(`  email: ${SEED_PROFESSOR_EMAIL}`);
  console.log(`  senha: ${SEED_PROFESSOR_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error('Seed falhou:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
