import { GqlExecutionContext } from '@nestjs/graphql';

export type CtxUser = {
  id: string;
  email: string;
  tokenId: string;
};

export interface IGqlContextWithUser extends GqlExecutionContext {
  user: CtxUser;
}
