import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { getStatusAccount } from 'utils/app';
import { IStaff, IRole } from './interfaces';
import { IUser } from '@app/auth/interfaces';
import { StaffDto, CreateAccountDto } from './dto';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(): Promise<IRole[]> {
    return await this.prisma.role.findMany({
      where: {
        id: {
          not: 1
        }
      },
      select: {
        id: true,
        name: true,
      },
    })
  }

  createAccount(account: CreateAccountDto): Promise<IUser> {
    return this.prisma.account.create({
      data: {
        ...account
      },
      select: {
        id: true,
        email: true
      }
    })
  }

  updateStatusAccount(accountId: number, accountStatus: string):  Promise<IUser> {
    return this.prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        status: getStatusAccount(accountStatus)
      },
      select: {
        id: true,
        email: true
      }
    })
  }

  updateAccount(accountId: number, params: CreateAccountDto): Promise<IUser>{
    return this.prisma.account.update({
      where:{
        id: accountId
      },
      data: {
        ...params
      },
      select: {
        id: true,
        email: true
      }
    })
  }

  async getAccountById(accountId: number): Promise<IUser> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId, roleId: {not: 1}, status: { not: 'DELETED'} },
      select: {
        id: true,
        email: true,
        status: true,
        roleId: true,
        role: { select: { name: true } },
        staff: { select: { name: true } },
        customer: { select: { name: true } },
      },
    });
  
  
    const { id, email, roleId } = account;
    let name = account.customer?.name || account.staff?.name;
  
    return { id, email, name, role: String(roleId), roleName: account.role.name };
  }

  getAccountByEmail(email: string) : Promise<IUser | {}> {
    return this.prisma.account.findUnique({
      where: {
        email
      }
    })
  }

  async getAccounts(): Promise<IUser[]> {
    const accounts = await this.prisma.account.findMany({
      where: { roleId: {not: 1}, status: { not: 'DELETED'} },
      select: {
        id: true,
        email: true,
        status: true,
        roleId: true,
        role: { select: { name: true } },
        staff: { select: { name: true } },
        customer: { select: { name: true } },
      },
    });
  
  
    return accounts.map((account) => {
      const { id, email, status, roleId } = account;
      const name = account.customer?.name || account.staff?.name;

      return {
        id,
        email,
        status,
        name,
        role: String(roleId),
        roleName: account.role.name
      }
    });
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
  
}
