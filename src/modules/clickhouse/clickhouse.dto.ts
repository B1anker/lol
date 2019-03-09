import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { ValidateIfNotEmpty } from '../../validation/ifNotEmpty';

export interface Common {
  value: number;
}

export interface Query {
  format: 'JSON';
}

export class GetSqlQuery {
  @IsString()
  readonly sql: string;

  @ValidateIfNotEmpty('String')
  readonly database?: string;

  @ValidateIfNotEmpty('String')
  readonly format?: string;
}

export class PostSqlQuery {
  @IsString()
  readonly sql: string;

  @ValidateIfNotEmpty('String')
  readonly database?: string;
}

export class CreatSqlQuery {
  @ValidateIfNotEmpty('String')
  readonly table?: string;

  @ValidateIfNotEmpty('String')
  readonly database?: string;
}

export class InsertSqlQuery {
  @IsString()
  readonly table: string;

  @ValidateIfNotEmpty('String')
  readonly database?: string;

  @ValidateNested()
  @IsDefined()
  readonly common: Common;

  @ValidateIfNotEmpty('Array')
  readonly series?: any[];
}
