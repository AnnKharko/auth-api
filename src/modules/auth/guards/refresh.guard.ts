import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { PayloadType } from '../token/type/payload.type';
import { errorMessage } from 'src/shared/error/error-messages';
import { JwtService } from 'src/infrastructure/jwt/jwt.service';
import { TokenModelService } from 'src/infrastructure/database/token/token-model.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly tokenModelService: TokenModelService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.req.headers.authorization) {
      throw new GraphQLError(errorMessage.UNAUTHORIZED);
    }

    const { id, email, tokenId } = await this.validateToken(
      ctx.req.headers.authorization,
    );
    ctx.user = {};
    ctx.user.id = id;
    ctx.user.email = email;
    ctx.user.tokenId = tokenId;

    return ctx;
  }

  async validateToken(auth: string) {
    const bearer = auth.split(' ')[0];
    const token = auth.split(' ')[1];

    if (bearer !== 'Bearer') {
      throw new GraphQLError(errorMessage.INVALID_REFRESH_TOKEN);
    }
    if (!token) {
      throw new GraphQLError(errorMessage.REFRESH_TOKEN_IS_REQUIRED);
    }

    this.jwtService.verifyRefreshToken(token);

    const payload = this.jwtService.getPayload(token) as PayloadType;

    if (!payload.id || !payload.email) {
      throw new GraphQLError(errorMessage.INVALID_TOKEN);
    }

    const tokens = await this.tokenModelService.findOne({
      refreshToken: token,
    });

    if (!tokens || !tokens.user || tokens.user.email !== payload.email) {
      throw new GraphQLError(errorMessage.UNAUTHORIZED);
    }
    return {
      tokenId: tokens._id,
      id: payload.id,
      email: payload.email,
    };
  }
}
