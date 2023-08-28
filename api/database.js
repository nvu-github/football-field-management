// import { Prisma, PrismaClient } from '@prisma/client'
import pkg from '@prisma/client'

const { Prisma, PrismaClient } = pkg
const prisma = new PrismaClient()
// const { prisma, Prisma } = ['', '']

export { prisma, Prisma }
