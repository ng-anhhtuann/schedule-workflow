import { Module } from '@nestjs/common';
import { TemporalService } from './temporal/temporal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5445,
      username: 'temporal',
      password: 'temporal',
      database: 'temporal',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [TemporalService, UserService],
})
export class AppModule {}
