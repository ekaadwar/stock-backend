import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsIn,
} from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsIn(['MALE', 'FEMALE'])
  @IsOptional()
  gender?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
