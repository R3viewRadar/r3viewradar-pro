// Stripe integration placeholder
// Connect your Stripe account by adding STRIPE_SECRET_KEY to .env.local

let stripeInstance: import("stripe").default | null = null;

export async function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("Stripe secret key not configured.");
    return null;
  }

  if (!stripeInstance) {
    const { default: Stripe } = await import("stripe");
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    });
  }

  return stripeInstance;
}

export async function createCheckoutSession({
  priceId,
  userId,
  returnUrl,
}: {
  priceId: string;
  userId: string;
  returnUrl: string;
}) {
  const stripe = await getStripe();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}/dashboard?upgraded=true`,
    cancel_url: `${returnUrl}/pricing`,
    metadata: { userId },
  });

  return session;
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const stripe = await getStripe();
  if (!stripe) return null;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
