import {IsString, MinLength} from 'class-validator';

export class SignInRequest {
    @IsString()
    username!: string;

    @IsString()
    @MinLength(4)
    password!: string;
}
