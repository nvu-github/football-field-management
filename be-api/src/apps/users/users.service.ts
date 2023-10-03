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

  getStaffs(): Promise<IStaff[] | []> {
    return this.prisma.staff.findMany()
  }
}
