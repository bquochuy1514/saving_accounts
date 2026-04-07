// prisma/seed.ts
import { PrismaClient } from '../generated/prisma/client';
import { hashPassword } from 'src/common/utils/hash-password.util';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@sotietkiem.com' },
  });

  if (existing) {
    console.log('Admin đã tồn tại, bỏ qua seed.');
    return;
  }

  const hashed = await hashPassword('Admin@123');

  await prisma.user.create({
    data: {
      fullName: 'Administrator',
      email: 'admin@sotietkiem.com',
      password: hashed,
      role: 'ADMIN',
    },
  });

  console.log('Tạo tài khoản admin thành công.');

  await prisma.customer.createMany({
    data: [
      {
        fullName: 'Khách hàng 1',
        idNumber: '056205008104',
        address: '12 Trương Hán Siêu - Nha Trang',
      },
      {
        fullName: 'Khách hàng 2',
        idNumber: '056205008105',
        address: '13 Trương Hán Siêu - Nha Trang',
      },
      {
        fullName: 'Khách hàng 3',
        idNumber: '056205008106',
        address: '14 Trương Hán Siêu - Nha Trang',
      },
    ],
  });

  console.log('Tạo khách hàng thành công.');

  await prisma.savingsType.createMany({
    data: [
      {
        minInitDeposit: 1000000,
        interestRate: 5,
        minAddDeposit: 100000,
        minWithdrawDays: 0,
        name: '3 tháng',
        termMonths: 3,
        isActive: true,
      },
      {
        minInitDeposit: 1000000,
        interestRate: 5.5,
        minAddDeposit: 100000,
        minWithdrawDays: 0,
        name: '6 tháng',
        termMonths: 6,
        isActive: true,
      },
      {
        minInitDeposit: 1000000,
        interestRate: 0.5,
        minAddDeposit: 100000,
        minWithdrawDays: 15,
        name: 'Không kỳ hạn',
        termMonths: 0,
        isActive: true,
      },
    ],
  });

  console.log('Tạo 3 loại sổ tiết kiệm thành công.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
