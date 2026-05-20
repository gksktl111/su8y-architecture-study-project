import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/http/auth.controller';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { TypeormUserRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { JwtStrategy } from './infrastructure/security/jwt.strategy';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import { CheckUsernameUseCase } from './application/use-cases/check-username.use-case';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';
import { ACCESS_TOKEN_ISSUER } from './application/ports/access-token-issuer.port';
import { JwtTokenIssuer } from './infrastructure/security/jwt-token-issuer';
import { AuthGuard } from './presentation/guards/auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'testrppgfaicalexpressionanalysis',
      signOptions: {
        expiresIn: '1h',
      },
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [AuthController],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeormUserRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: ACCESS_TOKEN_ISSUER, useClass: JwtTokenIssuer },
    SignUpUseCase,
    SignInUseCase,
    CheckUsernameUseCase,
    AuthGuard,
    JwtStrategy,
  ],
  exports: [AuthGuard, JwtStrategy],
})
export class AuthModule {}
