import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: {
      username: 'superAdmin',
      password: 'superAdmin',
    },
    update: {
      email: 'alice@prisma.io',
      username: 'superAdmin',
      password: 'superAdmin',
    },
    create: {
      email: 'alice@prisma.io',
      username: 'superAdmin',
      password: 'superAdmin',
    },
  });

  await prisma.menu.create({
    data: {
      path: null,
      parentId: null,
      name: '招聘系统',
      key: 'Recruitment',
      children: {
        createMany: {
          data: [
            {
              path: '/interview',
              name: '我的面试',
              key: 'Interview',
            },
            {
              path: '/resume',
              name: '简历管理',
              key: 'Resume',
            },
            {
              path: '/candidate',
              name: '候选人管理',
              key: 'Candidate',
            },
            {
              path: '/job',
              name: '岗位管理',
              key: 'Job',
            },
          ],
        },
      },
    },
  });

  await prisma.menu.create({
    data: {
      path: null,
      parentId: null,
      name: '系统设置',
      key: 'SystemSetting',
      children: {
        createMany: {
          data: [
            {
              path: '/user',
              name: '用户和权限',
              key: 'User',
            },
            {
              path: '/role',
              name: '角色管理',
              key: 'Role',
            },
          ],
        },
      },
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
