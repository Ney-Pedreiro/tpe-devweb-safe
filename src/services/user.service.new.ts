import { prisma } from '../database/prisma';
import { CreateUserDTO } from '../types/user.types';
import { hashPassword, comparePassword } from '../utils/password.util';

export class UserService {
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username }
    });
  }

  async createUser(data: CreateUserDTO) {
    const hashedPassword = hashPassword(data.password);
    
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string) {
    return comparePassword(plainPassword, hashedPassword);
  }
}
