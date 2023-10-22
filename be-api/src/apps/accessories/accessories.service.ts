import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { PayloadAccessoryTypeDto, PayloadAccessoryDto } from './dtos';
import { IAccessoryType, IAccessory } from './interfaces';

@Injectable()
export class AccessoriesService {
  constructor(private readonly prisma: PrismaService) {}

  createAccessory(payloads: PayloadAccessoryDto): Promise<IAccessory | any> {
    return this.prisma.accessory.create({
      data: { ...payloads },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  updateAccessory(
    id: number,
    payloads: PayloadAccessoryDto,
  ): Promise<IAccessory | any> {
    const accessory = { ...payloads };
    return this.prisma.accessory.update({
      where: {
        id,
      },
      data: accessory,
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  createImageAccessory(payloads: any): Promise<any> {
    return this.prisma.accessoryImage.createMany({
      data: [...payloads],
    });
  }

  deleteAccessory(id: number): Promise<any> {
    return this.prisma.accessory.delete({
      where: { id },
    });
  }

  deleteAccessoryImage(id: number): Promise<any> {
    return this.prisma.accessoryImage.delete({
      where: {
        id,
      },
    });
  }

  deleteAccessoryImages(accessoryId: number): Promise<any> {
    return this.prisma.accessoryImage.deleteMany({
      where: {
        accessoryId,
      },
    });
  }

  getAccessoryImage(id: number): Promise<any> {
    return this.prisma.accessoryImage.findUnique({
      where: {
        id,
      },
    });
  }

  getAccessoryImages(accessoryId: number): Promise<any> {
    return this.prisma.accessoryImage.findMany({
      where: {
        accessoryId,
      },
    });
  }

  async getAccessory(accessoryId: number): Promise<IAccessory> {
    const accessory = await this.prisma.accessory.findUnique({
      where: {
        id: accessoryId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        amount: true,
        price: true,
        accessoryType: {
          select: {
            id: true,
            name: true,
          },
        },
        accessoryImage: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    const {
      id,
      name,
      description,
      amount,
      price,
      accessoryImage,
      accessoryType,
    } = accessory;
    const formattedAccessory = {
      id,
      name,
      description,
      amount,
      price: Number(price),
      accessoryTypeId: accessoryType.id,
      accessoryTypeName: accessoryType.name,
      images: accessoryImage.map((image: any) => ({ ...image })),
    };

    return formattedAccessory;
  }

  async getAccessories(): Promise<IAccessory[]> {
    const accessories = await this.prisma.accessory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        amount: true,
        price: true,
        accessoryType: {
          select: {
            id: true,
            name: true,
          },
        },
        accessoryImage: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    return accessories.map((accessory) => {
      return {
        ...accessory,
        price: Number(accessory.price),
        description: accessory.description,
        accessoryTypeId: accessory.accessoryType.id,
        accessoryTypeName: accessory.accessoryType.name,
      };
    });
  }

  createAccessoryType(
    payloads: PayloadAccessoryTypeDto,
  ): Promise<IAccessoryType> {
    return this.prisma.accessoryType.create({
      data: {
        ...payloads,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  updateAccessoryType(
    id: number,
    payloads: PayloadAccessoryTypeDto,
  ): Promise<IAccessoryType> {
    return this.prisma.accessoryType.update({
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

  deleteAccessoryType(id: number): Promise<IAccessoryType> {
    return this.prisma.accessoryType.delete({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  getAccessoryTypes(): Promise<IAccessoryType[]> {
    return this.prisma.accessoryType.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  getAccessoryType(id: number): Promise<IAccessoryType> {
    return this.prisma.accessoryType.findUnique({
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
