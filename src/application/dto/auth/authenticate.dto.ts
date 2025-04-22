import { PartialType, OmitType } from '@nestjs/mapped-types';
import LoginDto from './login.dto';

class AuthenticateDto extends PartialType(OmitType(LoginDto, ['password'] as const)) {}

export default AuthenticateDto;
