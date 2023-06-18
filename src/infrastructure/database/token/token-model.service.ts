import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schema/token.schema';
import { CreateTokenDto } from 'src/modules/auth/token/dto/create-token.dto';
import { TokenDto } from 'src/modules/auth/token/dto/return-token.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class TokenModelService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  public async find(): Promise<Token[]> {
    return this.tokenModel.find().exec();
  }

  public async findOne(filter: FilterQuery<TokenDocument>): Promise<Token> {
    return await this.tokenModel.findOne(filter).populate({ path: 'user' });
  }

  public async create(createTokenDto: CreateTokenDto): Promise<Token> {
    const createdUser = new this.tokenModel({
      ...createTokenDto,
    });
    return await createdUser.save();
  }

  public async update(id: string, tokens: TokenDto): Promise<Token> {
    return await this.tokenModel.findOneAndUpdate(
      { _id: id },
      {
        ...tokens,
        updatedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  public async deleteByUserId(userId: string): Promise<void> {
    const userIdString = new ObjectId(userId).toString();
    await this.tokenModel.deleteMany({ user: userIdString });
  }

  public async deleteMany(ids: string[]) {
    return await this.tokenModel.deleteMany({ _id: { $in: ids } });
  }
}
