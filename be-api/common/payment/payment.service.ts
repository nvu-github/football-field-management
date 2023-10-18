import { Injectable } from "@nestjs/common";
import Stripe from 'stripe';

import configuration from 'config/configuration';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe
  
  constructor() {
    this.stripe = new Stripe(configuration().stripe.secretKey, {
      apiVersion: '2023-10-16'
    });
  }

  async createCustomer(name: string, email: string) {
    return await this.stripe.customers.create({
      name,
      email
    });
  }
}