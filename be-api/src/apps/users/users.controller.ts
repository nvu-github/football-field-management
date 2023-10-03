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
  HttpStatus
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import configuration from 'config/configuration';
import { UsersService } from './users.service';

import { StaffDto, CreateAccountDto } from './dto';

@ApiTags('Users')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private readonly ACCOUNTANT = 2
  private readonly RENTAL_AND_SALE = 3
  private readonly CUSTOMER = 4
  constructor(private readonly usersService: UsersService) {}

  @Post('account')
  async createAccount(@Body() body: CreateAccountDto) {
    try {
      const account = await this.usersService.getAccountByEmail(body.email) 
      if (account) {
        throw new HttpException('Email này đã tồn tại!', HttpStatus.BAD_REQUEST)
      }

      const accountCreated = await this.usersService.createAccount({...body, password: bcrypt.hashSync(body.password, +configuration().salt)})
      if (body.roleId === this.ACCOUNTANT || body.roleId === this.RENTAL_AND_SALE) {
        await this.usersService.createStaff(accountCreated.id)
      }
      if (body.roleId === this.CUSTOMER) {
        await this.usersService.createCustomer(accountCreated.id)
      }
      
      delete accountCreated.password
      return accountCreated
    } catch (err) {
      console.error(err)
      throw new HttpException('Tạo tài khoản thất bại!', HttpStatus.BAD_REQUEST)
    }
  }

  @Patch('staffs/:id')
  async updateStaffInfo(@Param('id') id: string, @Body() body: StaffDto, @Request() req) {
    const staff = await this.usersService.getStaffById(id)
    
    if (!staff)  {
      throw new HttpException('Nhân viên này không tồn tại!', HttpStatus.NOT_FOUND)
    }

    const staffUpdate = await this.usersService.updateStaffInfo(id, body)
    return staffUpdate
  }

  @Get('staffs')
  async findAll() {
    return await this.usersService.getStaffs();
  }

  @Get('staffs/:id')
  async findOne(@Param('id') id: string) {
    const staff = await this.usersService.getStaffById(id);
    
    if (!staff)  {
      throw new HttpException('Nhân viên này không tồn tại', HttpStatus.NOT_FOUND)
    }
    
    return staff
  }
}
