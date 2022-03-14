import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }


  async create(createUserDto: CreateUserDto) {
    const user: User = await this.userRepository.create(createUserDto);
    const result: User = await this.userRepository.save(user);
    console.log(result);
    return 'This action adds a new user';
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne(
      { email: loginUserDto.email },
      { select: ['id', 'username', 'password', 'isAdmin'] },
    );

    if (!user) {
      return "User Not Found!";
    }

    const passwordCorrect = await user.checkPassword(loginUserDto.password);
    if (!passwordCorrect) {
      return false;
    }

    const payload = { username: user.username, sub: user.id, isAdmin: user.isAdmin };
    return {
      access_token: this.jwtService.sign(payload),
    }

  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
