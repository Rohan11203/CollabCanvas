import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// 1. Extend the built-in types for TypeScript
declare module "next-auth" {
  // Extends the User object for callbacks
  interface User {
    token?: string;
    id?: string;
  }
  // Extends the Session object for useSession()
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // Extends the JWT token for callbacks
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user/signin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data.token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.username,
              token: data.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Credentials authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user/social-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, name: user.name }),
          });

          const data = await res.json();

          if (res.ok && data.token) {
            user.token = data.token;
            user.id = data.user.id;
            return true;
          }
          console.error("Failed to get token from Express for Google user");
          return false; 
        } catch (error) {
          console.error("Error in signIn callback for Google:", error);
          return false;
        }
      }
      return true; 
    },

    async jwt({ token, user }) {
      if (user?.token) {
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
