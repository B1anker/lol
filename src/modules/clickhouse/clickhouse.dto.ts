import { IsArray, IsDefined, IsString, Validate, ValidateIf, ValidateNested } from 'class-validator';

export interface Common {
  value: number;
}

export class GetSqlQuery {
  @IsString()
  readonly query: string;

  @IsString()
  readonly database: string;
}

export class PostSqlQuery {
  @IsString()
  readonly query: string;

  @ValidateIf((query, value) => {
    if (value === undefined) {
      return false;
    }
    return true;
  })
  @IsString()
  readonly database?: string;
}

export class InsertSqlQuery {
  @IsString()
  readonly table: string;

  @ValidateIf((query, value) => {
    if (value === undefined) {
      return false;
    }
    return true;
  })
  @IsString()
  readonly database: string;

  @ValidateNested()
  @IsDefined()
  readonly common: Common;

  @ValidateIf((query, value) => {
    if (value === undefined) {
      return false;
    }
    return true;
  })
  @IsArray()
  readonly series?: any[];
}
