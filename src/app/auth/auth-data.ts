export interface AuthData {
    accessToken: string;
    user: {
        id: number;
        email: string;
        password: string;
        nome: string
    }
}