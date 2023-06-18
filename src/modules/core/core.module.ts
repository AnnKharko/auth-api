import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './graphql/graphql-config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose/mongoose-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        !process.env.NODE_ENV ? '.env' : `${process.env.NODE_ENV}.env`,
      ],
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
})
export class CoreModule {}
