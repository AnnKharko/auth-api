import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      debug: this.configService.get('GRAPHQL_DEBUG'),
      playground: this.configService.get('GRAPHQL_PLAYGROUND') || true,
      context: ({ req, connection }) =>
        connection ? { req: connection.context } : { req },
      installSubscriptionHandlers: true,
      introspection: true,
      cache: 'bounded',
    };
  }
}
