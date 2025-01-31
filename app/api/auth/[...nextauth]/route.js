import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import { prismaClient } from "@/app/lib/db";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            console.log(user);
            if (!user.email) {
                return false;
            }

            try {
                const existingUser = await prismaClient.user.findUnique({
                    where: { email: user.email }
                });

                if (!existingUser) {
                    await prismaClient.user.create({
                        data: {
                            email: user.email,
                            provider: "google"
                        }
                    });
                }
            } catch (e) {
                console.error("Error handling user sign-in:", e);
                return false;
            }
            return true;
        }
    }
});

export { handler as GET, handler as POST };
