export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
