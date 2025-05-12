import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger';
import { API_KEY } from './tags';

export const SwaggerCustomOption: SwaggerCustomOptions = {
  swaggerUrl: process.env.SWAGGER_SERVER_URL + '/api',
  customfavIcon:
    'https://files.readme.io/b8914c390849fb2d9ab9446ea9a013b18641fc7d7eb45608e96862381833723e-small-1024.png',
  customSiteTitle: 'CMS Developer Hub',
  swaggerOptions: {
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    schemaSorter: 'alpha',
  },
};

export const SwaggerDocumentOption: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  deepScanRoutes: true,
  ignoreGlobalPrefix: false,
};

export const SwaggerDocumentConfig = () => {
  return new DocumentBuilder()
    .setTitle('Canteen Management API')
    .setDescription(
      `Welcome to the Canteen Management System Developer Hub! Here, you’ll find everything you need to integrate our APIs and unleash your creativity. Dive in and start building innovative apps that enhance the dining experience!`,
    )
    .setVersion('1.0')
    .addServer(process.env.SWAGGER_SERVER_URL, process.env.SWAGGER_SERVER_NAME)
    .addBearerAuth()
    .addApiKey(
      {
        name: 'x-account-key',
        type: 'apiKey',
        description:
          'The API key allows access to the API endpoint for integration with other apps.',
      },
      API_KEY,
    )
    .build();
};
