import { Injectable, InternalServerErrorException, MethodNotAllowedException } from '@nestjs/common';
import axios from 'axios';
import { CreatSqlQuery, GetSqlQuery, InsertSqlQuery, PostSqlQuery } from './clickhouse.dto';

@Injectable()
export class ClickhouseService {
  private ckUrl: string = 'http://127.0.0.1:8123';

  public async getQuery (query: GetSqlQuery) {
    let response;
    try {
      const sql = query.sql + (String(query.format) !== 'undefined' ? ` format ${query.format}` : ` format JSON`);
      response = await axios.get(`${this.ckUrl}`, {
        params: {
          query: sql,
          database: query.database
        }
      });
    } catch (err) {
      throw new InternalServerErrorException(err.response.data);
    }
    return response.data;
  }

  public async postQuery (body: PostSqlQuery) {
    let response;
    try {
      if (body.database) {
        response = await axios.post(`${this.ckUrl}?database=${body.database}&query=`, body.sql);
      } else {
        response = await axios.post(`${this.ckUrl}?query=`, body.sql);
      }
    } catch (err) {
      throw new InternalServerErrorException(err.response.data);
    }
    return response.data;
  }

  public async create (creatSqlQueryDto: CreatSqlQuery) {
    const { table, database } = creatSqlQueryDto;
    let databaseExist: boolean;
    if (database) {
      databaseExist = await this.checkDatabaseExsit(database);
      if (!databaseExist) {
        await this.postQuery({
          sql: `create database ${database}`
        });
      }
      if (table) {
        await this.postQuery({
          sql: table,
          database
        });
      }
    } else {
      if (table) {
        await this.postQuery({
          sql: table
        });
      } else {
        throw new MethodNotAllowedException('table或database至少有一个且为字符串');
      }
    }
    return '创建成功';
  }

  public async insert (body: InsertSqlQuery) {
    let response;
    let sql: string;
    try {
      const table: string = body.database ? `${body.database}.${body.table}` : body.table;
      sql = this.generateInserSql(table, body);
      response = await axios.post(`${this.ckUrl}?database=${body.database}&query=`, sql);
    } catch (err) {
      throw new InternalServerErrorException({
        errorMsg: err.response.data,
        sql
      });
    }
    return response.data;
  }

  private async checkDatabaseExsit (database: string): Promise<boolean> {
    if (!database) {
      return false;
    }
    const databases = await this.getQuery({
      sql: 'show databases'
    });
    return databases.data.some(({ name }) => {
      return name === database;
    });
  }

  private generateInserSql (table: string, body: InsertSqlQuery): string {
    let sql: string;
    if (Array.isArray(body.series)) {
      const series = body.series.map((ser) => {
        return Object.assign({}, ser, body.common);
      });
      const keys = Object.keys(series[0]).join(', ');
      const values = series.map((ser) => `(${Object.values(ser)
        .map((value) => {
          if (typeof value === 'string') {
            return `'${value}'`;
          }
          return value;
        }).join(', ')})`)
        .join(', ');
      sql = `insert into ${table} (${keys}) values ${values}`;
    } else {
      const keys = Object.keys(body.common).join(', ');
      const values = Object.values(body.common)
        .map((value) => {
          if (typeof value === 'string') {
            return `'${value}'`;
          }
          return value;
        })
        .join(', ');
      sql = `insert into ${table} (${keys}) values (${values})`;
    }
    return sql;
  }
}
