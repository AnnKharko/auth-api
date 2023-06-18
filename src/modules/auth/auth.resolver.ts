import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TokenDto } from './token/dto/return-token.dto';
import { IGqlContextWithUser } from './token/type/graphql-context.type';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { RegisteredUserDto } from './dto/registered-user.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { AuthGuard } from './guards/auth.guard';
import { SendDto } from 'src/shared/dto/send.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';
import { LoginArgs } from './args/login.args';
import { TokensWithRandomRecordsDto } from './dto/token-with-random-records.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Mutation(() => RegisteredUserDto)
  register(
    @Args('registerUserDto') registerUserDto: CreateUserDto,
  ): Promise<RegisteredUserDto> {
    return this.authService.register(registerUserDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Mutation(() => TokensWithRandomRecordsDto)
  login(
    @Args() { email, password }: LoginArgs,
  ): Promise<TokensWithRandomRecordsDto> {
    return this.authService.login(email, password);
  }

  @Mutation(() => TokenDto)
  @UseGuards(RefreshGuard)
  async refreshTokens(@Context() { user }: IGqlContextWithUser) {
    return this.authService.refreshTokens(user.id, user.email, user.tokenId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => SendDto)
  logout(@CurrentUser() { tokenId }: CurrentUserDto): Promise<SendDto> {
    return this.authService.logout(tokenId);
  }
}
