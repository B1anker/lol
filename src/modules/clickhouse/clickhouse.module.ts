import { ClickhouseController } from '@/modules/clickhouse/clickhouse.controller';
import { ClickhouseService } from '@/modules/clickhouse/clickhouse.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ClickhouseController],
  providers: [ClickhouseService],
  exports: [ClickhouseService],
})
export class ClickHouseModule {}
