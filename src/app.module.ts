import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { NewsModule } from './news/news.module';
import { CommentModule } from './comment/comment.module';
import { InvestModule } from './invest/invest.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HelperModule } from './helper/module/helper.module';
import { AuthenticationModule } from './authentication/module/authentication.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['dist/src/**/*.entity.js'],
        migrations: ['dist/src/migrations/*.js'],
        synchronize: true,
        //   migrationsTableName: 'migrations',
        //  dropSchema: true
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProjectModule,
    NewsModule,
    CommentModule,
    InvestModule,
    HelperModule,
    AuthenticationModule,
    VoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
