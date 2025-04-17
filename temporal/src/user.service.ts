import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createRandomUser(): Promise<User> {
    const user = this.userRepo.create({
      name: `User-${uuidv4().slice(0, 8)}`,
    });
    return this.userRepo.save(user);
  }
}
