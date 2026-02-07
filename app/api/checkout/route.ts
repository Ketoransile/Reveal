import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://reveal-analysis.vercel.app' : 'http://localhost:3000')}/dashboard/success?checkout_id={CHECKOUT_ID}`,
    server: "sandbox",
});
