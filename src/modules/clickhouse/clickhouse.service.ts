import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { GetSqlQuery, InsertSqlQuery, PostSqlQuery } from './clickhouse.dto';

@Injectable()
export class ClickhouseService {
  private ckUrl: string = 'http://127.0.0.1:8123';

  public async getQuery (query: GetSqlQuery) {
    let response;
    try {
      response = await axios.get(`${this.ckUrl}`, {
        params: query
      });
    } catch (err) {
      throw new InternalServerErrorException(err.response.data);
    }
    return {
      result: response.data
    };
  }

  public async postQuery (body: PostSqlQuery) {
    let response;
    try {
      if (body.database) {
        response = await axios.post(`${this.ckUrl}?database=${body.database}&query=`, body.query);
      } else {
        response = await axios.post(`${this.ckUrl}?query=`, body.query);
      }
    } catch (err) {
      throw new InternalServerErrorException(err.response.data);
    }
    return {
      result: response.data
    };
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
    return {
      result: response.data
    };
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
