import { PartialType, OmitType } from '@nestjs/mapped-types';
import CreateUserDto from './update-user.dto';

export default class CreateUserEntity extends PartialType(
  OmitType(CreateUserDto, ['id'] as const),
) {}
