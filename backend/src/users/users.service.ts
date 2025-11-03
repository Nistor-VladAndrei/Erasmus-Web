import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(userData: {
    username: string;
    passwordHash: string;
    role: string;
    isValidated?: boolean;
  }): Promise<User> {
    const user = this.usersRepository.create({
      ...userData,
      isValidated: userData.isValidated ?? false, // Default to false if not provided
    });
    return this.usersRepository.save(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Merge the update data with the existing user
    Object.assign(user, updateData);
    
    return this.usersRepository.save(user);
  }

  async findPendingUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isValidated: false },
      select: ['id', 'username', 'role', 'isValidated', 'createdAt'], // Don't return passwordHash
      order: { createdAt: 'DESC' }, // Most recent first
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'role', 'isValidated', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}