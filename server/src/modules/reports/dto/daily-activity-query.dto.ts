import { IsDateString, IsNotEmpty } from 'class-validator';

export class DailyActivityQueryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
