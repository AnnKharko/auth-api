import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
}

registerEnumType(UserRole, { name: 'UserRole' });
