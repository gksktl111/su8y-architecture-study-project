import {IsString, MinLength} from 'class-validator';

export class CheckUsernameParams {
    @IsString()
    @MinLength(4)
    username!: string;
}
