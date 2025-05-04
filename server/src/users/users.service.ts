import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  // In-memory users array for demonstration
  // In production, use a proper database
  private users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = this.users.find(user => user.email === createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      ...createUserDto,
      password: hashedPassword,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);
    
    // Return user without password
    const { password, ...result } = newUser;
    return result as User;
  }

  async findAll(): Promise<User[]> {
    return this.users.map(user => {
      const { password, ...result } = user;
      return result as User;
    });
  }

  async findOne(id: string): Promise<User> {
    const user = this.users.find(user => user.id === id);
    
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    
    const { password, ...result } = user;
    return result as User;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // If updating password, hash it
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date()
    };

    const { password, ...result } = this.users[userIndex];
    return result as User;
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    this.users.splice(userIndex, 1);
  }
}