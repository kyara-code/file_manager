import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export default function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("File Manager")
    .setDescription("File Manager - API")
    .setExternalDoc("Postman Collection", "/docs-json")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}