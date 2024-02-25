import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

    // estos decoradores indican y forzan el tipo de dato que debe de entrar
    
    @IsEmail() // tiene que tomar formato de email
    email: string;

    @IsString() // tiene que ser string
    name: string;

    @MinLength(6) // tiene que tener un minimo de 6 caracteres
    password: string;

}
