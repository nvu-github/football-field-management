import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  try {
    const passwordDefault = '123456';
    const saltDefault = 12;

    // delete all data
    await prisma.customer.deleteMany({});
    await prisma.staff.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.accessoryType.deleteMany({});

    // Seed roles
    await prisma.role.createMany({
      data: [
        { name: 'Ban quản lý sân' },
        { name: 'Nhân viên kế toán' },
        { name: 'Nhân viên cho thuê và bán phụ kiện' },
        { name: 'Khách hàng' },
      ],
    });

    // Seed accounts
    await prisma.account.createMany({
      data: [
        {
          email: 'admin@gmail.com',
          password: bcrypt.hashSync(passwordDefault, saltDefault),
          status: 'APPROVED',
          roleId: 1,
        },
        {
          email: 'staff1@gmail.com',
          password: bcrypt.hashSync(passwordDefault, saltDefault),
          status: 'APPROVED',
          roleId: 2,
        },
        {
          email: 'staff2@gmail.com',
          password: bcrypt.hashSync(passwordDefault, saltDefault),
          status: 'APPROVED',
          roleId: 3,
        },
        {
          email: 'user1@gmail.com',
          password: bcrypt.hashSync(passwordDefault, saltDefault),
          status: 'APPROVED',
          roleId: 4,
        },
        {
          email: 'user2@gmail.com',
          password: bcrypt.hashSync(passwordDefault, saltDefault),
          status: 'APPROVED',
          roleId: 4,
        },
      ],
    });

    // Seed staff
    await prisma.staff.createMany({
      data: [
        {
          name: 'Admin',
          phoneNumber: '01234567890',
          address: 'Phu Tho',
          gender: 'MALE',
          accountId: 1,
        },
        {
          name: 'Nguyen Van A',
          phoneNumber: '01234567890',
          address: 'Phu Tho',
          gender: 'MALE',
          accountId: 2,
        },
        {
          name: 'Nguyen Van B',
          phoneNumber: '09876543210',
          address: 'Ha Noi',
          gender: 'MALE',
          accountId: 3,
        },
      ],
    });

    // Seed customers
    await prisma.customer.createMany({
      data: [
        {
          name: 'Khach hang 1',
          teamName: 'Team A',
          phoneNumber: '0912341232',
          accountId: 4,
        },
        {
          name: 'Khach hang 2',
          teamName: 'Team B',
          phoneNumber: '0912341232',
          accountId: 5,
        },
      ],
    });

    // Seed accessory type
    await prisma.accessoryType.createMany({
      data: [
        {
          name: 'Phụ kiện thuê',
        },
        {
          name: 'Phụ kiện bán',
        },
      ],
    });

    // Seed football type
    await prisma.footballType.createMany({
      data: [
        {
          name: 'Sân 7 người',
        },
        {
          name: 'Sân 9 người',
        },
        {
          name: 'Sân 11 người',
        },
      ],
    });
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(() => {
    process.exit();
  });
