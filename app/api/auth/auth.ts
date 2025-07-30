import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "descope",
      name: "Descope",
      type: "oauth",
      clientId: process.env.AUTH_DESCOPE_ID!,
      clientSecret: process.env.AUTH_DESCOPE_SECRET!,
      issuer: process.env.AUTH_DESCOPE_ISSUER!,
      checks: ["pkce", "state"],
      authorization: {
        params: {
          scope: "openid email profile",
          response_type: "code",
        } 
      },
      token: {
        url: `${process.env.DESCOPE_BASE_URL}/oauth2/v1/token`,
      },
      userinfo: {
        url: `${process.env.DESCOPE_BASE_URL}/oauth2/v1/userinfo`,
      },
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name ?? `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
          email: profile.email,
          image: profile.picture,
        }
      },
    }
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true
    },
    async jwt({ token, account, profile }) {
      return token
    },
    async session({ session, token }) {
      return session
    },
  },
  debug: true,
})