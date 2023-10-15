import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import {
  PayloadLeasingDurationDto,
  PayloadFootballPitchTypeDto,
  PayloadFootballPitchDto,
  PayloadFootballPitchPriceDto,
} from './dtos';
import {
  ILeasingDuration,
  IFootballPitchType,
  IFootballPitch,
  IFootbalPitchPrice,
  IFootballPitchRenal,
} from './interfaces';

@Injectable()
export class FootballPitchesService {
  constructor(private readonly prisma: PrismaService) {}

  createFootballPitch(
    payloads: PayloadFootballPitchDto,
  ): Promise<IFootballPitch | any> {
    const footballPitch = { ...payloads };
    return this.prisma.footballPitch.create({
      data: footballPitch,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
    });
  }

  updateFootballPitch(
    id: number,
    payloads: PayloadFootballPitchDto,
  ): Promise<IFootballPitch | any> {
    const footballPitch = { ...payloads };
    return this.prisma.footballPitch.update({
      where: {
        id,
      },
      data: footballPitch,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
    });
  }

  createImageFootballPitch(payloads: any): Promise<any> {
    return this.prisma.footballImage.createMany({
      data: [...payloads],
    });
  }

  deleteFootballPitch(id: number): Promise<any> {
    return this.prisma.footballPitch.delete({
      where: { id },
    });
  }

  deleteFootballPitchImage(id: number): Promise<any> {
    return this.prisma.footballImage.delete({
      where: {
        id,
      },
    });
  }

  deleteFootballPitchImages(footballPitchId: number): Promise<any> {
    return this.prisma.footballImage.deleteMany({
      where: {
        footballPitchId,
      },
    });
  }

  getFootballPitchImage(id: number): Promise<any> {
    return this.prisma.footballImage.findUnique({
      where: {
        id,
      },
    });
  }

  getFootballPitchImages(footballPitchId: number): Promise<any> {
    return this.prisma.footballImage.findMany({
      where: {
        footballPitchId,
      },
    });
  }

  async getFootballPitch(footballPitchId: number): Promise<IFootballPitch> {
    const footballPitch = await this.prisma.footballPitch.findUnique({
      where: {
        id: footballPitchId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        footballType: {
          select: {
            id: true,
            name: true,
          },
        },
        footballImage: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    const { id, name, description, status, footballImage, footballType } =
      footballPitch;
    const formattedFootballPitch = {
      id,
      name,
      description,
      status,
      footballTypeId: footballType.id,
      footballTypeName: footballType.name,
      images: footballImage.map((image: any) => ({ ...image })),
    };

    return formattedFootballPitch;
  }

  async getFootballPitches(): Promise<IFootballPitch[]> {
    const footballFields = await this.prisma.footballPitch.findMany({
      select: {
        id: true,
        name: true,
        description: true,
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
        description: footballField.description,
        footballTypeName: footballField.footballType.name,
      };
    });
  }

  createLeasingDuration(
    payloads: PayloadLeasingDurationDto,
  ): Promise<ILeasingDuration | {}> {
    return this.prisma.leasingDuration.create({
      data: {
        ...payloads,
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
    payloads: PayloadLeasingDurationDto,
  ): Promise<ILeasingDuration | {}> {
    return this.prisma.leasingDuration.update({
      where: {
        id: leasingDurationId,
      },
      data: {
        ...payloads,
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
    payloads: PayloadFootballPitchTypeDto,
  ): Promise<IFootballPitchType> {
    return this.prisma.footbalType.create({
      data: {
        ...payloads,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  updateFootballPitchType(
    id: number,
    payloads: PayloadFootballPitchTypeDto,
  ): Promise<IFootballPitchType> {
    return this.prisma.footbalType.update({
      where: {
        id,
      },
      data: {
        ...payloads,
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

  async createFootballPitchPrice(
    payload: PayloadFootballPitchPriceDto,
  ): Promise<any> {
    return await this.prisma.footballPitchLeasingDuration.create({
      data: {
        ...payload,
      },
    });
  }

  async updateFootballPitchPrice(
    id: number,
    payload: PayloadFootballPitchPriceDto,
  ): Promise<any> {
    return await this.prisma.footballPitchLeasingDuration.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
  }

  async deleteFootballPitchPrice(id: number): Promise<any> {
    return await this.prisma.footballPitchLeasingDuration.delete({
      where: {
        id,
      },
    });
  }

  async getFootballPitchPrices(): Promise<IFootbalPitchPrice[]> {
    const footballPitchPrices =
      await this.prisma.footballPitchLeasingDuration.findMany({
        select: {
          id: true,
          price: true,
          footballPitchId: true,
          leasingDurationId: true,
          footballPitch: {
            select: {
              name: true,
            },
          },
          leasingDuration: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      });

    return footballPitchPrices.map((footballPitchPrice) => ({
      id: footballPitchPrice.id,
      footballPitchId: footballPitchPrice.footballPitchId,
      leasingDurationId: footballPitchPrice.leasingDurationId,
      footballPitchName: footballPitchPrice.footballPitch.name,
      leasingDurationName: `${footballPitchPrice.leasingDuration.startTime} - ${footballPitchPrice.leasingDuration.endTime}`,
      price: Number(footballPitchPrice.price),
    }));
  }

  async getFootballPitchPrice(priceId: number): Promise<IFootbalPitchPrice> {
    const footballPitchPrice =
      await this.prisma.footballPitchLeasingDuration.findUnique({
        where: {
          id: priceId,
        },
        select: {
          id: true,
          price: true,
          footballPitchId: true,
          leasingDurationId: true,
          footballPitch: {
            select: {
              name: true,
            },
          },
          leasingDuration: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      });

    return {
      id: footballPitchPrice.id,
      footballPitchId: footballPitchPrice.footballPitchId,
      leasingDurationId: footballPitchPrice.leasingDurationId,
      footballPitchName: footballPitchPrice.footballPitch.name,
      leasingDurationName: `${footballPitchPrice.leasingDuration.startTime} - ${footballPitchPrice.leasingDuration.endTime}`,
      price: Number(footballPitchPrice.price),
    };
  }

  async getFootballPitchRental(): Promise<IFootballPitchRenal[]> {
    const footballPitchRentals =
      await this.prisma.customerFootballPitchRental.findMany({
        select: {
          id: true,
          footballPitchLeasingDurationId: true,
          customerId: true,
          note: true,
          status: true,
          rentalDate: true,
          customer: {
            select: {
              name: true,
              teamName: true,
            },
          },
          footballPitchLeasingDuration: {
            select: {
              price: true,
              footballPitch: {
                select: {
                  name: true,
                },
              },
              leasingDuration: {
                select: {
                  startTime: true,
                  endTime: true,
                },
              },
            },
          },
        },
      });

    return footballPitchRentals.map((footballPitchRental) => {
      const {
        id,
        footballPitchLeasingDurationId,
        customerId,
        note,
        status,
        rentalDate,
        customer,
        footballPitchLeasingDuration,
      } = footballPitchRental;

      const customerName = customer.name || '';
      const startTime =
        footballPitchLeasingDuration.leasingDuration.startTime || '';
      const endTime =
        footballPitchLeasingDuration.leasingDuration.endTime || '';
      const footballPitchName =
        footballPitchLeasingDuration.footballPitch.name || '';
      const price = Number(footballPitchLeasingDuration.price) || 0;

      return {
        id,
        footballPitchLeasingDurationId,
        customerId,
        note,
        status,
        rentalDate,
        customerName,
        startTime,
        endTime,
        footballPitchName,
        price,
      };
    });
  }
}
