import { Injectable } from '@nestjs/common';
import { TokenDto } from './dto/return-token.dto';
import { TokenModelService } from 'src/infrastructure/database/token/token-model.service';
import { JwtService } from 'src/infrastructure/jwt/jwt.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenModelService: TokenModelService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(
    userId: string,
    email: string,
    tokenId?: string,
  ): Promise<TokenDto> {
    const tokens = this.jwtService.tokenizer(userId, email);

    if (tokenId) {
      return await this.tokenModelService.update(tokenId, { ...tokens });
    }
    return await this.tokenModelService.create({ ...tokens, user: userId });
  }
  public async deleteTokens(ids: string[]) {
    return this.tokenModelService.deleteMany(ids);
  }

  async deleteAllUserTokens(userId: string): Promise<void> {
    return await this.tokenModelService.deleteByUserId(userId);
  }
}
