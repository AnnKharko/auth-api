import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (!GqlExecutionContext.create(context).getContext().req.user) {
      return null;
    }

    const { id, email, role, password, tokenId } =
      GqlExecutionContext.create(context).getContext().req.user;

    return {
      id,
      email,
      role,
      password,
      tokenId,
    };
  },
);
