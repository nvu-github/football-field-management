import Stripe from 'stripe'
const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  try {
    const { amount, currency, customer, description } = req.body

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency,
      customer,
      description,
    })
    console.log(paymentIntent)

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred during payment processing.' })
  }
}
