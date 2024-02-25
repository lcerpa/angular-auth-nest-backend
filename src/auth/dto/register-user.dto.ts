import { IsEmail, MinLength, IsString } from "class-validator";


export class RegisterUserDto {

    @IsEmail() // tiene que tomar formato de email
    email: string;

    @IsString() // tiene que ser string
    name: string;

    @MinLength(6) // tiene que tener un minimo de 6 caracteres
    password: string;
}