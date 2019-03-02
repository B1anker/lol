import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { GetSqlQuery, InsertSqlQuery, PostSqlQuery } from './clickhouse.dto';
import { ClickhouseService } from './clickhouse.service';

@Controller('ck')
export class ClickhouseController {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  @Get('/query')
  public async query(@Query() query: GetSqlQuery) {
    return await this.clickhouseService.getQuery(query);
  }

  @Post('/query')
  public async post(@Body(new ValidationPipe()) body: PostSqlQuery) {
    return await this.clickhouseService.postQuery(body);
  }

  @Post('/insert')
  public async insert(@Body(new ValidationPipe()) body: InsertSqlQuery) {
    return await this.clickhouseService.insert(body);
  }
}
