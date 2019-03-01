import { IsString } from 'class-validator';

export class SqlQuery {
  @IsString()
  readonly sql: string;
}
