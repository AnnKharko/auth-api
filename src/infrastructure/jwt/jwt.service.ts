import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from 'src/modules/auth/token/dto/return-token.dto';
import * as jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { errorMessage } from 'src/shared/error/error-messages';
import { PayloadType } from 'src/modules/auth/token/type/payload.type';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  public tokenizer(userId: string, email: string): TokenDto {
    const accessToken: string = jwt.sign(
      { id: userId, email },
      this.configService.get('ACCESS_SECRET'),
      { expiresIn: this.configService.get('ACCESS_SECRET_LIFETIME') },
    );

    const refreshToken: string = jwt.sign(
      { id: userId, email },
      this.configService.get('REFRESH_SECRET'),
      { expiresIn: this.configService.get('REFRESH_SECRET_LIFETIME') },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public verifyToken(token: string) {
    jwt.verify(
      token,
      this.configService.get('ACCESS_SECRET'),
      { ignoreExpiration: false },
      (err: Error) => {
        if (err) {
          throw new GraphQLError(errorMessage.INVALID_TOKEN);
        }
      },
    );
  }

  public verifyRefreshToken(token: string) {
    jwt.verify(
      token,
      this.configService.get('REFRESH_SECRET'),
      { ignoreExpiration: false },
      (err: Error) => {
        if (err) {
          throw new GraphQLError(errorMessage.INVALID_TOKEN);
        }
      },
    );
  }

  public getPayload(token: string): PayloadType {
    return jwt.decode(token);
  }
}
