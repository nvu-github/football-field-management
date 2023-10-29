import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { IUser } from './interfaces';
import { SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(payloads: SignUpDto): Promise<IUser | undefined> {
    const { name, teamName, email, phoneNumber, password } = payloads;
    const account = await this.prisma.account.create({
      data: {
        email,
        password,
        roleId: 1,
      },
      select: {
        id: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    const customer = await this.prisma.customer.create({
      data: {
        name,
        teamName,
        phoneNumber,
        accountId: account.id,
      },
      select: {
        name: true,
      },
    });

    return {
      id: account.id,
      email: account.email,
      name: customer.name,
      role: account.role.name,
    };
  }

  async getUser(emailUser: string): Promise<IUser | undefined> {
    const account = await this.prisma.account.findUnique({
      where: { email: emailUser },
      select: {
        id: true,
        email: true,
        password: true,
        roleId: true,
        role: { select: { name: true } },
        staff: { select: { name: true, avatar: true } },
        customer: { select: { name: true, avatar: true } },
      },
    });

    if (!account) {
      return undefined;
    }

    const { id, email, password, roleId } = account;
    const name = account.customer?.name || account.staff?.name;
    const avatar = account.customer?.avatar || account.staff?.avatar;

    return {
      id,
      email,
      password,
      name,
      role: account.role.name,
      roleId,
      avatar,
    };
  }

  async getAccountByEmail(emailUser: string): Promise<IUser | undefined> {
    return this.prisma.account.findFirst({
      where: {
        email: emailUser,
      },
    });
  }

  async getUserById(idUser: number): Promise<IUser | undefined> {
    const account = await this.prisma.account.findUnique({
      where: { id: idUser },
      select: {
        id: true,
        email: true,
        password: true,
        role: { select: { name: true } },
        staff: { select: { name: true } },
        customer: { select: { id: true, name: true } },
      },
    });

    const { id, email, password } = account;
    let name = account.customer?.name || account.staff?.name;
    if (!name && account.role.name === 'ADMIN') {
      name = 'admin';
    }

    return {
      id,
      email,
      password,
      name,
      role: account.role.name,
      customerId: account.customer ? account.customer.id : null,
    };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
