import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: "sandbox", // Defaults to sandbox for now as per user request
});
