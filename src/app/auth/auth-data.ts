export interface AuthData {
    accessToken: string;
    user: {
        id: number;
        email: string;
        password: string;
        name: string
    }
}