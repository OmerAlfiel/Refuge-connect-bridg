import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  REFUGEE = 'refugee',
  VOLUNTEER = 'volunteer',
  NGO = 'ngo',
  ADMIN = 'admin',
}

export class UserRoleExample {
  @ApiProperty({
    enum: UserRole,
    example: UserRole.REFUGEE,
    description: 'User role'
  })
  role: UserRole;
}