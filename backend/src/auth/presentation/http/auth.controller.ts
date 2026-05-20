import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpUseCase } from '../../application/use-cases/sign-up.use-case';
import { SignInUseCase } from '../../application/use-cases/sign-in.use-case';
import { CheckUsernameUseCase } from '../../application/use-cases/check-username.use-case';
import { SignUpRequest } from './dto/sign-up.request';
import { SignInRequest } from './dto/sign-in.request';
import { CheckUsernameParams } from './dto/check-username.params';
import { SignUpResponse } from './dto/sign-up.response';
import { SignInResponse } from './dto/sign-in.response';
import { CheckUsernameResponse } from './dto/check-username.response';
import { AuthExceptionFilter } from '../filters/auth-exception.filter';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly checkUsernameUseCase: CheckUsernameUseCase,
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

  @Get('check_username/:username')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async checkUsername(
    @Param() params: CheckUsernameParams,
  ): Promise<CheckUsernameResponse> {
    await this.checkUsernameUseCase.execute(params);
    return { message: 'Successfully check username' };
  }
}
