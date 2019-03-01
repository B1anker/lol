import { ClickHouseModule } from '@/modules/clickhouse/clickhouse.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ClickHouseModule
  ]
})
export class AppModule {}
