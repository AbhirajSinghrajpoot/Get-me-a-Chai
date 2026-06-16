import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
import connectDb from '@/db/connectDb';
import User from '@/models/User';

export const authOptions = NextAuth({
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
    ],
    callbacks: {
      async signIn({ user, account }) {
        if (account.provider === "github") {
          await connectDb()
          const currentUser = await User.findOne({ email: user.email })
          if (!currentUser) {
            const username = (user.email || "").split("@")[0]
            await User.create({
              email: user.email,
              name: user.name,
              username: username,
            })
          }
          return true
        }
        return false
      },

      async jwt({ token, account }) {
        if (account) {
          await connectDb()
          const dbUser = await User.findOne({ email: token.email }).lean()
          if (dbUser) {
            token.username = dbUser.username
          }
        }
        return token
      },

      async session({ session, token }) {
        if (token?.username) {
          session.user.username = token.username
        } else {
          await connectDb()
          const dbUser = await User.findOne({ email: session.user.email }).lean()
          if (dbUser) {
            session.user.username = dbUser.username
            session.user.name = dbUser.name || dbUser.username
          }
        }
        return session
      },
    }
  })

export { authOptions as GET, authOptions as POST }