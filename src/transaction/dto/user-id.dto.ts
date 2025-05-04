import { IsString, IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @IsString()
  @IsNotEmpty()
  user: string;
}
