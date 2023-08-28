/**
 * @type {import('express').RequestHandler}
 */

export default async (req, res) => {
  console.log(req.cookies)
  res.send('oke')
}
