import { forwardRef, Logger, Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Suggestion, SuggestionSchema } from './schema/suggestion.schema';
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
    MongooseModule.forFeature([{ name: Suggestion.name, schema: SuggestionSchema }]),
  ],
  providers: [SuggestionsService, Logger],
  controllers: [SuggestionsController],
})
export class SuggestionsModule {}
