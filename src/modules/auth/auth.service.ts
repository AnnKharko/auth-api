import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token/token.service';
import { GraphQLError } from 'graphql';
import { TokenDto } from './token/dto/return-token.dto';
import { errorMessage } from 'src/shared/error/error-messages';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserService } from 'src/modules/user/user.service';
import { RegisteredUserDto } from './dto/registered-user.dto';
import { SendDto } from 'src/shared/dto/send.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { TokensWithRandomRecordsDto } from './dto/token-with-random-records.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  public async login(
    email: string,
    password: string,
  ): Promise<TokensWithRandomRecordsDto> {
    const user = await this.userService.findUser({
      email: email.toLowerCase(),
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const randomRecords = await this.redisService.getRandomRecords(10);

      const tokens = await this.tokenService.generateTokens(
        user._id.toString(),
        email,
      );
      return { tokens, randomRecords } as TokensWithRandomRecordsDto;
    } else {
      throw new GraphQLError(errorMessage.WRONG_EMAIL_OR_PASSWORD);
    }
  }

  public async refreshTokens(
    userId: string,
    email: string,
    tokenId: string,
  ): Promise<TokenDto> {
    try {
      return await this.tokenService.generateTokens(userId, email, tokenId);
    } catch (err) {
      throw new GraphQLError(err.message);
    }
  }

  async register(createUser: CreateUserDto): Promise<RegisteredUserDto> {
    const user = await this.userService.createUser(createUser);
    const tokens = await this.tokenService.generateTokens(
      user._id.toString(),
      user.email,
    );

    return {
      user,
      tokens,
    };
  }

  async logout(tokenId: string): Promise<SendDto> {
    await this.tokenService.deleteTokens([tokenId]);
    return {
      status: 200,
      message: 'Success',
    };
  }

  @OnEvent('logoutAllSessions')
  protected async logoutAllSessions(userId: string): Promise<void> {
    await this.tokenService.deleteAllUserTokens(userId);
  }
}
