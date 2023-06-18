import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { PayloadType } from '../token/type/payload.type';
import { errorMessage } from 'src/shared/error/error-messages';
import { JwtService } from 'src/infrastructure/jwt/jwt.service';
import { TokenModelService } from 'src/infrastructure/database/token/token-model.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenModelService: TokenModelService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (!ctx.req.headers.authorization) {
      throw new GraphQLError(errorMessage.UNAUTHORIZED);
    }
    const { id, email, role, password, tokenId } = await this.validateToken(
      ctx.req.headers.authorization,
    );

    ctx.req.user = {};
    ctx.req.user.id = id;
    ctx.req.user.email = email;
    ctx.req.user.role = role;
    ctx.req.user.password = password;

    ctx.req.user.tokenId = tokenId;
    return ctx;
  }

  async validateToken(auth: string) {
    const bearer = auth.split(' ')[0];
    const token = auth.split(' ')[1];

    if (bearer !== 'Bearer') {
      throw new GraphQLError(errorMessage.INVALID_TOKEN);
    }
    if (!token) {
      throw new GraphQLError(errorMessage.TOKEN_IS_REQUIRED);
    }
    this.jwtService.verifyToken(token);

    const payload = this.jwtService.getPayload(token) as PayloadType;

    if (!payload.id || !payload.email) {
      throw new GraphQLError(errorMessage.INVALID_TOKEN);
    }

    const tokens = await this.tokenModelService.findOne({
      accessToken: token,
    });

    if (!tokens || !tokens.user || tokens.user.email !== payload.email) {
      throw new GraphQLError(errorMessage.UNAUTHORIZED);
    }

    return {
      id: payload.id,
      email: payload.email,
      role: tokens.user.role,
      password: tokens.user.password,
      tokenId: tokens._id,
    };
  }
}
