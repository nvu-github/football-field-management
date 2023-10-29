import { Injectable } from '@nestjs/common';
import { formatISO9075 } from 'date-fns';

import { PrismaService } from '@src/prisma.service';

import {
  PayloadLeasingDurationDto,
  PayloadFootballPitchTypeDto,
  PayloadFootballPitchDto,
  PayloadFootballPitchPriceDto,
  PayloadCustomerRentalDto,
} from './dtos';
import {
  ILeasingDuration,
  IFootballPitchType,
  IFootballPitch,
  IFootbalPitchPrice,
  IFootballPitchRental,
  IFootballPitchRentalNow,
} from './interfaces';

import { format } from 'date-fns';

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
    return this.prisma.footballType.create({
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
    return this.prisma.footballType.update({
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
    return this.prisma.footballType.delete({
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
    return this.prisma.footballType.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  getFootballPitchType(id: number): Promise<IFootballPitchType> {
    return this.prisma.footballType.findUnique({
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

  async getFootballPitchRentals(): Promise<IFootballPitchRental[]> {
    const footballPitchRentals =
      await this.prisma.customerFootballPitchRental.findMany({
        select: {
          id: true,
          footballPitchId: true,
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
        footballPitchId,
        footballPitchLeasingDurationId,
        customerId,
        status,
        note,
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
        footballPitchId,
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

  async getFootballPitchRentalNows(
    rentalDateQuery: Date,
  ): Promise<IFootballPitchRentalNow[] | void> {
    console.log(rentalDateQuery);
    const footballPitchRentalNows =
      await this.prisma.footballPitchLeasingDuration.findMany({
        select: {
          id: true,
          price: true,
          footballPitch: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true,
              footballImage: {
                select: {
                  id: true,
                  url: true,
                },
              },
              footballType: {
                select: {
                  id: true,
                  name: true,
                },
              },
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

    const customerFootballPitchRental = await this.getFootballPitchRentals();

    return footballPitchRentalNows.map((footballPitchRentalNow) => {
      const { id: footballPitchLeasingDurationId, price } =
        footballPitchRentalNow;
      const { id, name, description, footballImage, footballType } =
        footballPitchRentalNow.footballPitch;
      const { startTime, endTime } = footballPitchRentalNow.leasingDuration;
      const images = footballImage;

      const customerRentalFound = customerFootballPitchRental.find(
        (customerRental) =>
          customerRental.footballPitchLeasingDurationId ===
            footballPitchLeasingDurationId &&
          id === customerRental.footballPitchId &&
          format(new Date(customerRental.rentalDate), 'dd/MM/yyyy') ===
            format(new Date(rentalDateQuery), 'dd/MM/yyyy'),
      );
      const rentalDate = customerRentalFound
        ? customerRentalFound.rentalDate
        : formatISO9075(new Date(rentalDateQuery));
      const statusFootballRental = customerRentalFound
        ? customerRentalFound.status
        : 'EMPTY';

      return {
        id,
        name,
        description,
        status: statusFootballRental,
        price: Number(price),
        rentalDate,
        startTime,
        endTime,
        images,
        footballPitchLeasingDurationId,
        footballPitchTypeId: footballType.id,
        footballPitchTypeName: footballType.name,
      };
    });
  }

  async getFootballPitchCustomerRentalHistories(
    customerId: number,
  ): Promise<any> {
    const footballPitchRentalCustomerHistories: any[] = await this.prisma
      .$queryRaw`
        SELECT  c.id, 
                c.name, 
                f.name as footballPitchName,
                cfpr.status, 
                cfpr.rental_date as rentalDate, 
                fpl.price, 
                ld.start_time as startTime, 
                ld.end_time as endTime 
        FROM customers c 
        INNER JOIN customer_football_pitch_rental cfpr on c.id = cfpr.customer_id
        INNER JOIN football_pitch_leasing_duration fpl on fpl.id = cfpr.football_pitch_lease_duration_id
        INNER JOIN football_pitches f on f.id = fpl.football_pitch_id
        INNER JOIN leasing_durations ld on ld.id = fpl.leasing_duration_id
        WHERE c.id = ${customerId}
      `;
    return footballPitchRentalCustomerHistories || [];
  }

  async createCustomerFootballPitchRental(payload: any): Promise<any> {
    delete payload.leasingDurationId;
    return await this.prisma.customerFootballPitchRental.create({
      data: {
        ...payload,
      },
      select: {
        id: true,
      },
    });
  }

  async createAccessoryFootballPitchRental(payload: any): Promise<any> {
    return await this.prisma.accessoryRentalCustomer.createMany({
      data: payload,
    });
  }

  async getAdminConfirmCustomerRental(): Promise<any> {
    const footballPitchRentalCustomers: any[] = await this.prisma.$queryRaw`
        SELECT  c.id, 
                c.name, 
                f.name as footballPitchName,
                cfpr.status, 
                cfpr.rental_date as rentalDate, 
                fpl.price, 
                ld.start_time as startTime, 
                ld.end_time as endTime 
        FROM customers c 
        INNER JOIN customer_football_pitch_rental cfpr on c.id = cfpr.customer_id
        INNER JOIN football_pitch_leasing_duration fpl on fpl.id = cfpr.football_pitch_lease_duration_id
        INNER JOIN football_pitches f on f.id = fpl.football_pitch_id
        INNER JOIN leasing_durations ld on ld.id = fpl.leasing_duration_id
      `;
    return footballPitchRentalCustomers || [];
  }
}
