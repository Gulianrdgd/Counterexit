import NextAuth from "next-auth"
declare module "next-auth" {
    interface Session {
        user: {
            name: any;
            image: string,
            id: number,
            email: string
        }
    }
}
