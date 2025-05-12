import { forwardRef, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { AuditLogsModule } from '../../shared/modules/audit-logs/audit-logs.module';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    forwardRef(() => AuditLogsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ApiKeysModule),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  providers: [CategoriesService, Logger],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
