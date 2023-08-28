/**
 * @type {import('express').RequestHandler}
 */
import { prisma } from '@database'

export default async (req, res) => {
  try {
    const { userId } = req.params

    const postFound = await prisma.post.findMany({
      where: {
        authorId: +userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!postFound) {
      return res.status(400).send({ message: 'No found posts!' })
    }

    res.status(200).send({ message: 'Get posts success!', data: postFound })
  } catch (err) {
    res.status(400).send({ message: 'Get post failed!' })
  }
}
