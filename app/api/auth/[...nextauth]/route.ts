import NextAuth, { User, Session, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";


const authOptions: NextAuthOptions = {
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: {
                    label: 'email',
                    type: 'text',
                },
                password: { label: "Password", type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const { email, password } = credentials;
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const response = await res.json();
                const allRoles = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/role`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${response.data.token}`,
                    }
                })
                const allRolesResponse = await allRoles.json()
                const talentRole = allRolesResponse.data.find((role: any) => role.name === 'talent')
                const allUserRoles = response.data.user.userRoles
                const userTalentRole = allUserRoles.find((role: any) => role.roleId === talentRole.id)

                if (res.status === 401) {
                    throw new Error(response.message || 'Authentication error');
                }
                if (!userTalentRole) {
                    throw new Error("Access Denied")
                }
                if (response && response.status === 200 && response.data) {
                    const user = response.data;
                    return user;
                } else {
                    throw new Error(response.message || 'Authentication error');
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60, // 30 minutes session timeout
        updateAge: 24 * 60 * 60, // 24 hours 
    },

    callbacks: {
        async jwt({ token, user, session, trigger }: { token: JWT; user: User | undefined; session?: Session; trigger?: string }) {
            if (user) return { ...token, ...user };
            if (session && trigger === 'update') {
                return { ...token, user: { ...session.user } }
            }
            return token;
        },

        async session({ token, session }: { token: JWT; session: Session }) {
            session.user = token.user;
            session.token = token.token;
            return session;
        },
        async signIn() {
            return true;
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            return baseUrl;
        },
    },
    pages: {
        signIn: '/login',
        newUser: '/register'
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }