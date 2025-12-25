import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard, RolesGuard } from './common/guards';
import { AdvertisementModule } from './modules/advertisement';
import { ArticleModule } from './modules/article';
import { AuditLogModule } from './modules/audit-log';
import { AuthModule } from './modules/auth';
import { CategoryModule } from './modules/category';
import { CommentModule } from './modules/comment';
import { GalleryModule } from './modules/gallery';
import { LanguageModule } from './modules/language';
import { NewsletterModule } from './modules/newsletter';
import { SettingModule } from './modules/setting';
import { TagModule } from './modules/tag';
import { UploadModule } from './modules/upload';
import { UserModule } from './modules/user';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.production'],
    }),
    PrismaModule,
    AuthModule,
    LanguageModule,
    CategoryModule,
    UserModule,
    TagModule,
    ArticleModule,
    CommentModule,
    SettingModule,
    NewsletterModule,
    AdvertisementModule,
    GalleryModule,
    UploadModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guards - order matters: AuthGuard runs first, then RolesGuard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
