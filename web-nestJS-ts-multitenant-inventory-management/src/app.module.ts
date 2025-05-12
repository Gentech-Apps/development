import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { RolesModule } from './modules/roles/roles.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { SharedModule } from './shared/modules/shared.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { ItemsModule } from './modules/items/items.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { ActivityLogsModule } from './shared/modules/activity-logs/activity-logs.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';

@Module({
  imports: [
    AppConfigModule,
    TenantsModule,
    RolesModule,
    SharedModule,
    UsersModule,
    CategoriesModule,
    SuggestionsModule,
    ItemsModule,
    FeedbacksModule,
    ActivityLogsModule,
    ApiKeysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
