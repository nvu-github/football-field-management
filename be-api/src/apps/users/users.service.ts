import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { IStaff } from './interfaces';
import { IUser } from '@app/auth/interfaces';
import { StaffDto, CreateAccountDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getAccountByEmail(email: string) : Promise<IUser | {}> {
    return this.prisma.account.findUnique({
      where: {
        email
      }
    })
  }

  createAccount(account: CreateAccountDto): Promise<IUser> {
    return this.prisma.account.create({
      data: {
        ...account
      }
    })
  }

  createStaff(accountId: number): Promise<IUser | {}> {
    return this.prisma.staff.create({
      data: {
        name: '',
        phoneNumber: '',
        dateOfBirth: null,
        address: '',
        gender: 'OTHER',
        account: {
          connect: {id: accountId}
        }
      }
    })
  }

  createCustomer(accountId: number): Promise<IUser | {}> {
    return this.prisma.customer.create({
      data: {
        name: '',
        teamName: '',
        phoneNumber: '',
        account: {
          connect: {id: accountId}
        }
      }
    })
  }

  updateStaffInfo(id: string, staffInfo: StaffDto): Promise<IStaff | {}> {
    return this.prisma.staff.update({
      where: {
        id: +id
      }, 
      data: {
        ...staffInfo
      }
    })
  }

  getStaffById(id: string): Promise<IStaff | {}> {
    return this.prisma.staff.findUnique({
      where: {
        id: +id
      }
    })
  }

  async getAccounts(): Promise<any> {
    const accounts = await this.prisma.account.findMany({
      where: { roleId: {not: 1} },
      select: {
        id: true,
        email: true,
        status: true,
        role: { select: { name: true } },
        staff: { select: { name: true } },
        customer: { select: { name: true } },
      },
    });
  
  
    return accounts.map((account) => {
      const { id, email, status } = account;
      const name = account.customer?.name || account.staff?.name;

      return {
        id,
        email,
        status,
        name,
        role: account.role.name
      }
    });
  }
}
