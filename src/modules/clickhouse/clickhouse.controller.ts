import { Controller, ForbiddenException, Get, Header, Options, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { SqlQuery } from './clickhouse.dto';
import { ClickhouseService } from './clickhouse.service';

const whileList = [
  'b1anker.com'
];

@Controller('ck')
export class ClickhouseController {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  @Options('/*')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  public async options(@Req() req: Request) {
    if (!req.headers.origin) {
      throw new ForbiddenException();
    } else {
      const pass = whileList.some((item) => req.headers.origin.indexOf(item) !== -1);
      if (!pass) {
        throw new ForbiddenException();
      }
    }
    return null;
  }

  @Get('/query')
  @Header('Access-Control-Allow-Origin', '*')
  public async query(@Query() query: SqlQuery) {
    return await this.clickhouseService.query(query.sql);
  }
}
