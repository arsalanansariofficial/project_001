import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const urls = await prisma.url.findMany();
  console.log(urls);
}

main()
  .catch(async e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
