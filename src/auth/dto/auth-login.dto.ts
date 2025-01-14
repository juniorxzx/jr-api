import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthLoginDTO{

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string
}