import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
