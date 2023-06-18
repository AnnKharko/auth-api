import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Injectable()
export class UserModelService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async find(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  public async findOne(filter: FilterQuery<UserDocument>): Promise<User> {
    return await this.userModel.findOne(filter);
  }

  public async create(
    createUserDto: CreateUserDto,
    code: string,
  ): Promise<User> {
    const createdUser = new this.userModel({
      ...createUserDto,
      confirmEmailCode: code,
    });
    return await createdUser.save();
  }

  public async update(
    findBy: Partial<User>,
    params: Partial<User>,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(findBy, params);
  }

  public async deleteById(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }
}
