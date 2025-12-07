import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthDate: string; // nanti di-convert ke Date

  @IsString()
  @IsIn(['MALE', 'FEMALE'])
  gender: string;

  @IsString()
  @MinLength(6)
  password: string;
}
