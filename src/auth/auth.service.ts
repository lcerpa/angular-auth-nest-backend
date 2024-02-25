import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interfaces/jwt.interface';
import { LoginResponse } from 'src/interfaces/login-response.interface';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);

    try {
      // aqui desestructura el password y todo lo demas lo almacena en una variable de nombre userData
      const { password, ...userData } = createUserDto;
      // 1 - Encriptar contraseña
      //const newUser = new this.userModel( createUserDto );
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      // 2 - Guardar el usuario
      // sino se pone el away y hay un error el error va a salir de este servicio
      await newUser.save();
      // le puso este guion bajo para renombrarlo porque ya existe una propiedad con ese nombre y es para que no choquen
      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      console.log('error de codigo', error.code);
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happend');
    }
  }
 
  async register( registerUserDto: RegisterUserDto): Promise<LoginResponse>{

    const user = await this.create( registerUserDto );
    console.log(user);
    
    return {
      user: user, 
      token: this.getJWT({id: user._id})};
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    console.log(loginDto);
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    
    if ( !bcryptjs.compareSync( password, user.password )) {
      throw new UnauthorizedException('Not valid credentials - password');
      
    }

    const { password:_, ...rest } = user.toJSON();
    //const payload = { sub: user._id, username: user.name };
  
    return {
      user: rest,
      //token: await this.jwtService.signAsync(payload),
      token: this.getJWT({ id: user.id }) 
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUserById( id: string ){
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();
    return rest;
      }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJWT(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

}
