import prisma    from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import Github from "next-auth/providers/github"

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.id = user.id
                token.name = user.name
            }

            return token
        },
        session: ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name as string
            }
            return session
        }
    }
}
