import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ClickhouseService {
  private ckUrl: string = 'http://127.0.0.1:8123';

  public async query (query) {
    const response = await axios.get(`${this.ckUrl}`, {
      params: {
        query
      }
    });
    return {
      result: response.data
    };
  }
}
