import {IsString, MinLength} from 'class-validator';

export class SignUpRequest {
    @IsString()
    username!: string;

    @IsString()
    @MinLength(4)
    password!: string;
}
