import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpUseCase } from '../../application/use-cases/sign-up.use-case';
import { SignInUseCase } from '../../application/use-cases/sign-in.use-case';
import { SignUpRequest } from './dto/sign-up.request';
import { SignInRequest } from './dto/sign-in.request';
import { SignUpResponse } from './dto/sign-up.response';
import { SignInResponse } from './dto/sign-in.response';
import { AuthExceptionFilter } from '../filters/auth-exception.filter';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async signUp(@Body() request: SignUpRequest): Promise<SignUpResponse> {
    return this.signUpUseCase.execute(request);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async signIn(@Body() request: SignInRequest): Promise<SignInResponse> {
    return this.signInUseCase.execute(request);
  }
}
