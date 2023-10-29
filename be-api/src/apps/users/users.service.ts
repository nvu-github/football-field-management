import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { getStatusAccount } from 'utils/app';
import { IStaff, IRole } from './interfaces';
import { IUser } from '@app/auth/interfaces';
import { StaffDto, CreateAccountDto, UpdatePersonalDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(): Promise<IRole[]> {
    return await this.prisma.role.findMany({
      where: {
        id: {
          not: 1,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  createAccount(account: CreateAccountDto): Promise<IUser> {
    return this.prisma.account.create({
      data: {
        ...account,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  updateStatusAccount(
    accountId: number,
    accountStatus: string,
  ): Promise<IUser> {
    return this.prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        status: getStatusAccount(accountStatus),
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  updateAccount(accountId: number, params: CreateAccountDto): Promise<IUser> {
    return this.prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        ...params,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  updatePersonalCustomer(accountId: number, payload: UpdatePersonalDto) {
    return this.prisma.customer.update({
      where: {
        accountId: accountId,
      },
      data: {
        ...payload,
      },
    });
  }

  updatePersonalStaff(accountId: number, payload: any) {
    return this.prisma.staff.update({
      where: {
        accountId: accountId,
      },
      data: {
        ...payload,
      },
    });
  }

  async getCustomerInfo(accountId: number): Promise<any> {
    const customerInfo = await this.prisma.customer.findUnique({
      where: {
        accountId,
      },
      select: {
        id: true,
        name: true,
        teamName: true,
        phoneNumber: true,
        account: {
          select: {
            email: true,
          },
        },
      },
    });
    const { id, name, teamName, phoneNumber, account } = customerInfo;
    return {
      id,
      name,
      teamName,
      phoneNumber,
      email: account.email,
    };
  }

  async getStaffInfo(accountId: number): Promise<any> {
    const customerInfo = await this.prisma.staff.findUnique({
      where: {
        accountId,
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        dateOfBirth: true,
        address: true,
        gender: true,
        account: {
          select: {
            email: true,
          },
        },
      },
    });
    const { id, name, phoneNumber, dateOfBirth, address, gender, account } =
      customerInfo;
    return {
      id,
      name,
      phoneNumber,
      dateOfBirth,
      address,
      gender,
      email: account.email,
    };
  }

  async getAccountById(accountId: number): Promise<IUser> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId, roleId: { not: 1 }, status: { not: 'DELETED' } },
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

    return {
      id,
      email,
      name,
      role: String(roleId),
      roleName: account.role.name,
    };
  }

  getAccountByEmail(email: string): Promise<IUser | {}> {
    return this.prisma.account.findUnique({
      where: {
        email,
      },
    });
  }

  async getAccounts(): Promise<IUser[]> {
    const accounts = await this.prisma.account.findMany({
      where: { roleId: { not: 1 }, status: { not: 'DELETED' } },
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
        roleName: account.role.name,
      };
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
          connect: { id: accountId },
        },
      },
    });
  }

  createCustomer(accountId: number): Promise<IUser | {}> {
    return this.prisma.customer.create({
      data: {
        name: '',
        teamName: '',
        phoneNumber: '',
        account: {
          connect: { id: accountId },
        },
      },
    });
  }

  updateStaffInfo(id: string, staffInfo: StaffDto): Promise<IStaff | {}> {
    return this.prisma.staff.update({
      where: {
        id: +id,
      },
      data: {
        ...staffInfo,
      },
    });
  }

  getStaffById(id: string): Promise<IStaff | {}> {
    return this.prisma.staff.findUnique({
      where: {
        id: +id,
      },
    });
  }
}
