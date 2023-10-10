import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import {
  ParamLeasingDurationDto,
  ParamFootballPitchType,
  ParamFootballPitchDto,
} from './dtos';
import {
  ILeasingDuration,
  IFootballPitchType,
  IFootballPitch,
} from './interfaces';

@Injectable()
export class FootballPitchesService {
  constructor(private readonly prisma: PrismaService) {}

  createFootballPitch(
    params: ParamFootballPitchDto,
  ): Promise<IFootballPitch | any> {
    return this.prisma.footballPitch.create({
      data: {
        ...params,
        footballTypeId: params.typeId,
      },
    });
  }

  async getFootballPitches(): Promise<IFootballPitch[]> {
    const footballFields = await this.prisma.footballPitch.findMany({
      select: {
        id: true,
        name: true,
        desciption: true,
        status: true,
        footballType: {
          select: {
            name: true,
          },
        },
      },
    });

    return footballFields.map((footballField) => {
      return {
        ...footballField,
        description: footballField.desciption,
        footballTypeName: footballField.footballType.name,
      };
    });
  }

  createLeasingDuration(
    params: ParamLeasingDurationDto,
  ): Promise<ILeasingDuration | {}> {
    return this.prisma.leasingDuration.create({
      data: {
        ...params,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  updateLeasingDuration(
    leasingDurationId: number,
    params: ParamLeasingDurationDto,
  ): Promise<ILeasingDuration | {}> {
    return this.prisma.leasingDuration.update({
      where: {
        id: leasingDurationId,
      },
      data: {
        ...params,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  deleteLeasingDuration(
    leasingDurationId: number,
  ): Promise<ILeasingDuration | {}> {
    return this.prisma.leasingDuration.delete({
      where: {
        id: leasingDurationId,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  getLeasingDurations(): Promise<ILeasingDuration[]> {
    return this.prisma.leasingDuration.findMany({
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  getLeasingDuration(leasingDurationId: number): Promise<ILeasingDuration> {
    return this.prisma.leasingDuration.findUnique({
      where: {
        id: leasingDurationId,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  createFootballPitchType(
    params: ParamFootballPitchType,
  ): Promise<IFootballPitchType> {
    return this.prisma.footbalType.create({
      data: {
        ...params,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  updateFootballPitchType(
    id: number,
    params: ParamFootballPitchType,
  ): Promise<IFootballPitchType> {
    return this.prisma.footbalType.update({
      where: {
        id,
      },
      data: {
        ...params,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  deleteFootballPitchType(id: number): Promise<IFootballPitchType> {
    return this.prisma.footbalType.delete({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  getFootballPitchTypes(): Promise<IFootballPitchType[]> {
    return this.prisma.footbalType.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  getFootballPitchType(id: number): Promise<IFootballPitchType> {
    return this.prisma.footbalType.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
