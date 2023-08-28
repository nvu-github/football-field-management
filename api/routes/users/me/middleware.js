/**
 * @type {import('express').RequestHandler}
 */
export const middleware = (req, res, next) => {
  console.log('middle ware')
}

export { middleware as middleware1 }
