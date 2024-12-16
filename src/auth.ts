import { sendVerificationRequest } from "@/lib/server/sendSignInVerificationEmail";
import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";

export const providers = [
  Nodemailer({
    id: "email_signin",
    name: "email_signin",
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
    sendVerificationRequest,
    async generateVerificationToken() {
      return crypto.randomUUID();
    },
    normalizeIdentifier(identifier: string): string {
      // Get the first two elements only,
      // separated by `@` from user input.
      const [local, domain] = identifier.toLowerCase().trim().split("@");
      // The part before "@" can contain a ","
      // but we remove it on the domain part
      const first_domain_part = domain.split(",")[0];
      return `${local}@${first_domain_part}`;

      // You can also throw an error, which will redirect the user
      // to the sign-in page with error=EmailSignin in the URL
      // if (identifier.split("@").length > 2) {
      //   throw new Error("Only one email allowed")
      // }
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    // async redirect({ baseUrl, url }) {
    //   console.log("redirect", baseUrl, url);
    //
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) {
    //     return `${baseUrl}${url}`;
    //   }
    //
    //   // Allows callback URLs on the same origin
    //   if (new URL(url).origin === baseUrl) {
    //     return url;
    //   }
    //
    //   return baseUrl;
    // },
  },
});
