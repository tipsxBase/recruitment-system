import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const superAdmin = await prisma.user.create({
    data: {
      email: 'alice@prisma.io',
      username: 'superAdmin',
      password: 'superAdmin',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
