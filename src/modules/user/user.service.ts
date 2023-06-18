import { Injectable } from '@nestjs/common';
import { User } from '../../infrastructure/database/user/schema/user.schema';
import { GraphQLError } from 'graphql';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { errorMessage } from 'src/shared/error/error-messages';
import { UserModelService } from 'src/infrastructure/database/user/user-model.service';
import { SendDto } from 'src/shared/dto/send.dto';
import { generateRandString } from 'src/shared/util/generate-rand-string.util';
import { Types } from 'mongoose';
import { ResetPasswordPayload } from '../mail/payload/reset-password.payload';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ObjectId } from 'mongodb';
import { ConfirmEmailPayload } from '../mail/payload/confirm-email.payload';

@Injectable()
export class UserService {
  constructor(
    private readonly userModelService: UserModelService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModelService.find();
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModelService.findOne({
      email: createUserDto.email,
    });

    if (user) {
      throw new GraphQLError(errorMessage.USER_ALREADY_EXISTS);
    }
    const code = generateRandString(6).slice(0, 6);
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userModelService.create(createUserDto, code);

    this.eventEmitter.emit(
      'user.confirm-email',
      new ConfirmEmailPayload({
        userEmail: createUserDto.email,
        name: createUserDto.name,
        code: code,
      }),
    );
    return newUser;
  }

  public async confirmEmail(userId: string, code: string) {
    const user = await this.userModelService.findOne({
      confirmEmailCode: code,
    });

    if (user && user._id.toString() === userId) {
      await this.userModelService.update(
        { _id: user._id },
        { confirmEmailCode: null, confirmedEmail: true },
      );

      return {
        message: 'Successful',
        status: 201,
      };
    } else {
      throw new GraphQLError(errorMessage.INVALID_CODE);
    }
  }

  async findUser(param: Partial<User>): Promise<User> {
    return this.userModelService.findOne(param);
  }

  public async updatePassword(
    userId: Types.ObjectId,
    hashedPassword: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<SendDto> {
    if (await bcrypt.compare(currentPassword, hashedPassword)) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userModelService.update(
        { _id: userId },
        { password: newHashedPassword },
      );

      return {
        message: 'Successful',
        status: 201,
      };
    } else {
      throw new GraphQLError(errorMessage.INVALID_CURRENT_PASSWORD);
    }
  }

  public async forgotPassword(email: string): Promise<SendDto> {
    const user = await this.userModelService.findOne({ email });

    if (user) {
      const link = generateRandString(60);

      await this.userModelService.update(
        { _id: user._id },
        { restoreKey: link },
      );

      this.eventEmitter.emit(
        'user.reset-password',
        new ResetPasswordPayload({
          url: link,
          name: `${user.name}`,
          userEmail: email,
        }),
      );

      return {
        message: `Check your email ${user.email} to continue reset password`,
        status: 201,
      };
    } else {
      return {
        message: 'Failed',
        status: 400,
      };
    }
  }

  public async confirmRestorePassword(
    restoreKey: string,
    password: string,
  ): Promise<SendDto> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModelService.update(
      { restoreKey },
      {
        password: hashedPassword,
        restoreKey: null,
      },
    );

    this.eventEmitter.emit('logoutAllSessions', user._id);

    return {
      message: 'Successful',
      status: 201,
    };
  }

  public async deleteUser(id: Types.ObjectId): Promise<SendDto> {
    await this.userModelService.deleteById(new ObjectId(id).toString());
    this.eventEmitter.emit('logoutAllSessions', id);

    return {
      message: 'Successful',
      status: 201,
    };
  }
}
