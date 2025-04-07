import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost:27017`, {
      user: 'root',
      pass: 'example',
      dbName: 'accounting',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
