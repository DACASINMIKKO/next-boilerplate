import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as
     * a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string,
            email: string,
            roleId: string,
            isCompleted: boolean
            first_name: string
            last_name: string
        }
        token: string
    }

    interface User {
        id: string,
        email: string,
        roleId: string,
        isCompleted: boolean
        first_name: string
        last_name: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string,
            email: string,
            roleId: string,
            isCompleted: boolean
            first_name: string
            last_name: string
        }
        token: string
    }
}