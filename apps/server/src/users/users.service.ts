import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserDto } from './user.schema';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(params: any) {
    return { id: 1, ...params };
  }

  async update(id: number, params: any) {
    return { id, ...params };
  }

  async delete(id: number) {
    return { id };
  }

  async findOne(params: UserDto) {
    return this.prisma.user.findUnique({
      where: {
        username: params.username,
      },
    });
  }

  async findAll() {
    return [{ id: 1 }, { id: 2 }];
  }
}
