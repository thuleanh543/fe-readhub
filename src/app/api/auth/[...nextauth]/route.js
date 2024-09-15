import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const authOptions = {
    providers: [
        CredentialsProvider( {
            name: "Credentials",
            credentials: {
                gmail: { label: "Gmail", type: "text", placeholder: "johnsmith@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize ( credentials ) {
                if ( credentials )
                {
                    try
                    {
                        // Gửi yêu cầu đăng nhập bằng axios
                        const response = await axios.post(
                            `${ process.env.REACT_APP_API_BASE_URL }authen/login?email=${ credentials.gmail }&password=${ credentials.password }`,
                            {
                                headers: { "Content-Type": "application/json" },
                            }
                        );

                        // Xử lý dữ liệu phản hồi
                        const res = response.data;

                        if ( res?.message )
                        {
                            throw new Error( "Login Failed" );
                        }

                        if ( res )
                        {
                            return res; // Trả về thông tin người dùng nếu đăng nhập thành công
                        } else
                        {
                            return null; // Trả về null nếu không có thông tin người dùng
                        }
                    } catch ( error )
                    {
                        throw new Error( "Login Failed" );
                    }
                } else
                {
                    return null; // Trả về null nếu không có thông tin đăng nhập
                }
            },
        } ),
    ],
    callbacks: {
        async session ( { session, token } ) {
            return {
                ...session,
                user: {
                    id: token.id,
                    email: token.email,
                },
                accessToken: token.token,
            };
        },
        async jwt ( { token, user } ) {
            if ( user )
            {
                return { ...token, ...user };
            }
            return token;
        },
    },
};

export default NextAuth( authOptions );
