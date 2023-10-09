import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { ParamLeasingDurationDto, ParamFootbalFieldType } from './dtos';
import { ILeasingDuration, IFootballFieldType, IFootballField } from './interfaces';

@Injectable()
export class FootballFieldsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFootballFields(): Promise<IFootballField[]> {
   const footballFields = await this.prisma.footballPitch.findMany({
    select: {
      id: true,
      name: true,
      desciption: true,
      status: true,
      footballType: {
        select: {
          name: true
        }
      },
    }
   })

   return footballFields.map((footballField) => {
    return {
      ...footballField,
      description: footballField.desciption,
      footballTypeName: footballField.footballType.name
    }
   })
  }

  createLeasingDuration(params: ParamLeasingDurationDto): Promise<ILeasingDuration | {}>  {
    return this.prisma.leasingDuration.create({
      data: {
        ...params
      },
      select: {
        id: true,
        startTime: true,
        endTime: true
      }
    })
  }

  updateLeasingDuration(leasingDurationId: number, params: ParamLeasingDurationDto): Promise<ILeasingDuration | {}>  {
    return this.prisma.leasingDuration.update({
      where: {
        id: leasingDurationId
      },
      data: {
        ...params
      },
      select: {
        id: true,
        startTime: true,
        endTime: true
      }
    })
  }

  deleteLeasingDuration(leasingDurationId: number): Promise<ILeasingDuration | {}>  {
    return this.prisma.leasingDuration.delete({
      where: {
        id: leasingDurationId
      },
      select: {
        id: true,
        startTime: true,
        endTime: true
      }
    })
  }

  getLeasingDurations(): Promise<ILeasingDuration[]> {
    return this.prisma.leasingDuration.findMany({
      select: {
        id: true,
        startTime: true,
        endTime: true
      }
    })
  }

  getLeasingDuration(leasingDurationId: number): Promise<ILeasingDuration> {
    return this.prisma.leasingDuration.findUnique({
      where: {
        id:leasingDurationId
      },
      select: {
        id: true,
        startTime: true,
        endTime: true
      }
    })
  }

  createFootballFieldType(params: ParamFootbalFieldType): Promise<IFootballFieldType> {
    return this.prisma.footbalType.create({
      data: {
        ...params
      },
      select: {
        id: true,
        name: true
      }
    })
  }

  updateFootballFieldType(id: number, params: ParamFootbalFieldType): Promise<IFootballFieldType> {
    return this.prisma.footbalType.update({
      where: {
        id
      },
      data: {
        ...params
      },
      select: {
        id: true,
        name: true
      }
    })
  }

  deleteFootballFieldType(id: number): Promise<IFootballFieldType> {
    return this.prisma.footbalType.delete({
      where: {
        id
      },
      select: {
        id: true,
        name: true
      }
    })
  }

  getFootballFieldTypes(): Promise<IFootballFieldType[]> {
    return this.prisma.footbalType.findMany({
      select: {
        id: true,
        name: true
      }
    })
  }

  getFootballFieldType(id: number): Promise<IFootballFieldType> {
    return this.prisma.footbalType.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true
      }
    })
  }
}
