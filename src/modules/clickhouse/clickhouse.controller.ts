import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreatSqlQuery, GetSqlQuery, InsertSqlQuery, PostSqlQuery } from './clickhouse.dto';
import { ClickhouseService } from './clickhouse.service';

@Controller('ck')
export class ClickhouseController {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  /**
   * 用sql查询数据库信息，表信息等，如:
   * 列出数据库列表
   * @param {String} [sql] = SHOW databases
   *
   * 列出数据中monitor中表为frontend的100条数据
   * @param {String} [sql] = SELECT * FROM frontend LIMIT 100
   * @param {String} [database] = monitor
   * ...
   */
  @Get('/query')
  public async query(@Query() query: GetSqlQuery) {
    return await this.clickhouseService.getQuery(query);
  }

  /**
   * 实际上接口都是调用同一个，但是创建，插入，删除等操作只能用POST请求，如：
   * 创建数据库monitor
   * @param {String} [sql] CREATE DATABASE monitor
   *
   * 删除数据库monitor
   * @param {String} [sql] DROP = DATABASE monitor
   *
   * 在数据库monitor中创建表frontend
   * @param {String} [sql] = CREATE TABLE frontend(day Date DEFAULT toDate(its),endpoint UInt32,its UInt32,metric String,submetric String,value Float32,page String,browser String,protocol String,system String,_cnt UInt32 DEFAULT 1) ENGINE=MergeTree(day, (endpoint, day), 8192)
   * @param {String} [database] = monitor
   * ...
   */
  @Post('/query')
  public async post(@Body(new ValidationPipe()) body: PostSqlQuery) {
    return await this.clickhouseService.postQuery(body);
  }

  /**
   * 优化post接口，创建数据库/表单独写一个接口，如：
   * @param {String} [table] = CREATE TABLE frontend(day Date DEFAULT toDate(its),endpoint UInt32,its UInt32,metric String,submetric String,value Float32,page String,browser String,protocol String,system String,_cnt UInt32 DEFAULT 1) ENGINE=MergeTree(day, (endpoint, day), 8192)
   * @param {String} [database] = monitor
   * ...
   */
  @Post('/create')
  public async creat(@Body(new ValidationPipe()) body: CreatSqlQuery) {
    return await this.clickhouseService.create(body);
  }

  /**
   * 优化post接口[需要把common对象插入到每个series的项里，组成一条表数据]，往表中插入数据，如：
   * @param {String} [table] = frontend
   * @param {String} [database] = monitor
   * @param {Object} [common] = {
   *  "page": "https://b1anker.com",
   *  "browser": "Chrome 74",
   *  "protocol": "https",
   *  "system": "Mac OS 10.14",
   *  "endpoint": 1
   *  "metric": "",
   *  "submetric": "fps",
   * }
   * @param {Object} [common] = [{
   *    "its": 1551536672,
   *    "value": 53
   *  },
   *  {
   *    "its": 1551536678,
   *    "value": 54
   *  }]
   * ...
   */
  @Post('/insert')
  public async insert(@Body(new ValidationPipe()) body: InsertSqlQuery) {
    return await this.clickhouseService.insert(body);
  }
}
