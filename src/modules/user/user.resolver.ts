import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../../infrastructure/database/user/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUserDto } from '../auth/dto/current-user.dto';
import { SendDto } from 'src/shared/dto/send.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConfirmRestorePassArgs } from './args/restore-password.args';
import { UpdatePasswordArgs } from './args/update-password.args';
import { ConfirmEmailArgs } from './args/confirm-email.args';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Mutation(() => User)
  createUser(
    @Args('createUserDto', { type: () => CreateUserDto })
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Mutation(() => SendDto)
  async confirmEmail(
    @Args() { userId, code }: ConfirmEmailArgs,
  ): Promise<SendDto> {
    return await this.userService.confirmEmail(userId, code);
  }

  @Mutation(() => SendDto)
  @UseGuards(AuthGuard)
  async updatePassword(
    @Args() { currentPassword, newPassword }: UpdatePasswordArgs,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<SendDto> {
    return await this.userService.updatePassword(
      user.id,
      user.password,
      currentPassword,
      newPassword,
    );
  }

  @Mutation(() => SendDto)
  async forgotPassword(@Args('email') email: string) {
    return await this.userService.forgotPassword(email.toLowerCase());
  }

  @Mutation(() => SendDto)
  async confirmRestorePassword(
    @Args() { restoreKey, newPassword }: ConfirmRestorePassArgs,
  ): Promise<SendDto> {
    return await this.userService.confirmRestorePassword(
      restoreKey,
      newPassword,
    );
  }

  @Mutation(() => SendDto)
  @UseGuards(AuthGuard)
  async deleteUser(@CurrentUser() user: CurrentUserDto): Promise<SendDto> {
    return await this.userService.deleteUser(user.id);
  }
}
