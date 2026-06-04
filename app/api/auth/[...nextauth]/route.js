import NextAuth from 'next-auth'
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import connectDb from '@/db/connectDb';
import User from '@/models/User';
import Payment from '@/models/Payment';
 

// Ensure DB connected before NextAuth handlers run
await connectDb()

export const authoptions =  NextAuth({
    providers: [
      // OAuth authentication providers...
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
    //   AppleProvider({
    //     clientId: process.env.APPLE_ID,
    //     clientSecret: process.env.APPLE_SECRET
    //   }),
    //   FacebookProvider({
    //     clientId: process.env.FACEBOOK_ID,
    //     clientSecret: process.env.FACEBOOK_SECRET
    //   }),
    //   GoogleProvider({
    //     clientId: process.env.GOOGLE_ID,
    //     clientSecret: process.env.GOOGLE_SECRET
    //   }),
    //   // Passwordless / email sign in
    //   EmailProvider({
    //     server: process.env.MAIL_SERVER,
    //     from: 'NextAuth.js <no-reply@example.com>'
    //   }),
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        if (account.provider === "github") {
          await connectDb()
          // Look up using the email from the OAuth user object
          const currentUser = await User.findOne({ email: user.email })
          if (!currentUser) {
            // Create with required schema fields
            await User.create({
              email: user.email,
              name: user.name,
              Username: (user.email || "").split("@")[0],
            })
          }
          return true
        }
        return false
      },
      
      async session({ session, user, token }) {
        const dbUser = await User.findOne({ email: session.user.email })
        if (dbUser) {
          // Expose Username as the display name used across the app
          session.user.name = dbUser.Username
        }
        return session
      },
    } 
  })

  export { authoptions as GET, authoptions as POST}