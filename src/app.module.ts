import { Module } from '@nestjs/common';
import { AuthModule } from './auth-service/auth.module';
import { BlogModule } from './blog-service/blog.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [AuthModule, BlogModule, GatewayModule],
})
export class AppModule {}
