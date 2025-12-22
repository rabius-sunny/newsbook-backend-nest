import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdvertisementModule } from './modules/advertisement';
import { ArticleModule } from './modules/article';
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
      envFilePath: '.env',
    }),
    PrismaModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
