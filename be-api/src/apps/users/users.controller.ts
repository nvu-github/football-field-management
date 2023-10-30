import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import configuration from 'config/configuration';
import { UsersService } from './users.service';

import { StaffDto, CreateAccountDto, UpdatePersonalDto } from './dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private readonly ACCOUNTANT = 2;
  private readonly RENTAL_AND_SALE = 3;
  private readonly CUSTOMER = 4;
  constructor(private readonly usersService: UsersService) {}

  @Get('roles')
  async getRoles() {
    return await this.usersService.getRoles();
  }

  @Post('account')
  async createAccount(@Body() body: CreateAccountDto) {
    try {
      const account = await this.usersService.getAccountByEmail(body.email);
      if (account) {
        throw new HttpException(
          'Email này đã tồn tại!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const accountCreated = await this.usersService.createAccount({
        ...body,
        password: bcrypt.hashSync(body.password, +configuration().salt),
      });
      if (
        body.roleId === this.ACCOUNTANT ||
        body.roleId === this.RENTAL_AND_SALE
      ) {
        await this.usersService.createStaff(accountCreated.id);
      }
      if (body.roleId === this.CUSTOMER) {
        await this.usersService.createCustomer(accountCreated.id);
      }

      delete accountCreated.password;
      return accountCreated;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Tạo tài khoản thất bại!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('account/:id/accept')
  async acceptAccount(@Param('id') id: string, @Body() body: any) {
    const account = await this.usersService.getAccountById(+id);

    if (!account) {
      throw new HttpException(
        'Tài khỏan này không tồn tại!',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.usersService.updateStatusAccount(+id, body.status);
  }

  @Patch('personal-info/customer')
  async updatePersonalInfoCustomer(
    @Request() req: any,
    @Body() body: UpdatePersonalDto,
  ) {
    const { id } = req.user;

    return await this.usersService.updatePersonalCustomer(+id, body);
  }

  @Patch('personal-info/staff')
  async updatePersonalInfoStaff(
    @Request() req: any,
    @Body() body: UpdatePersonalDto,
  ) {
    const { id } = req.user;

    return await this.usersService.updatePersonalStaff(+id, body);
  }

  @Get('personal-info/customer')
  async getPersonalInfoCustomer(@Request() req: any) {
    const { id } = req.user;

    return await this.usersService.getCustomerInfo(+id);
  }

  @Get('personal-info/staff')
  async getPersonalInfoStaff(@Request() req: any) {
    const { id } = req.user;

    return await this.usersService.getStaffInfo(+id);
  }

  @Patch('account/:id')
  async updateAccount(@Param('id') id: string, @Body() body: CreateAccountDto) {
    const account = await this.usersService.getAccountById(+id);
    if (body.roleId !== 4 && account.email === body.email) {
      delete body.email;
    }
    const accountUpdated = await this.usersService.updateAccount(+id, body);
    return accountUpdated;
  }

  @Delete('account/:id')
  deleteAccount(@Param('id') id: string) {
    const deleteStatus = 'deleted';
    return this.usersService.updateStatusAccount(+id, deleteStatus);
  }

  @Get('accounts')
  async getAccounts() {
    return await this.usersService.getAccounts();
  }

  @Get('account/:id')
  async getAccount(@Param('id') id: string) {
    const account = await this.usersService.getAccountById(+id);

    if (!account) {
      throw new HttpException(
        'Tài khỏan này không tồn tại!',
        HttpStatus.NOT_FOUND,
      );
    }
    return account;
  }

  @Patch('staff/:id')
  async updateStaffInfo(
    @Param('id') id: string,
    @Body() body: StaffDto,
    @Request() req,
  ) {
    const staff = await this.usersService.getStaffById(id);

    if (!staff) {
      throw new HttpException(
        'Nhân viên này không tồn tại!',
        HttpStatus.NOT_FOUND,
      );
    }

    const staffUpdate = await this.usersService.updateStaffInfo(id, body);
    return staffUpdate;
  }

  @Get('staff/:id')
  async findOne(@Param('id') id: string) {
    const staff = await this.usersService.getStaffById(id);

    if (!staff) {
      throw new HttpException(
        'Nhân viên này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    return staff;
  }
}
