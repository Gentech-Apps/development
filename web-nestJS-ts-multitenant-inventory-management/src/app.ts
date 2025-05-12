import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './shared/exceptions/unified-http-exception.filter';
import { UnifiedResponseInterceptor } from './shared/interceptors/unified-response.interceptor';
import { SetupSwaggerDocumentation } from './swagger';
import { ActivityLogsService } from './shared/modules/activity-logs/activity-logs.service';

const NestAppOptions: NestApplicationOptions = {
  bodyParser: true,
  rawBody: true,
  logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
};

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, NestAppOptions);

  // INFO: Global path to access apis
  app.setGlobalPrefix('api');

  //Helmet
  app.use(helmet());

  // INFO: Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // INFO: Global Interceptors
  const activityLogsService = app.get(ActivityLogsService);
  app.useGlobalInterceptors(new UnifiedResponseInterceptor(activityLogsService));

  // INFO: Global Filters
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost, activityLogsService));

  // INFO: Swagger Documentation
  SetupSwaggerDocumentation(app);

  // INFO: Server PORT
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  // listen port should be at the end
  await app.listen(port);
};
