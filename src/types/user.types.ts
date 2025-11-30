export interface CreateUserDTO {
  username: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
