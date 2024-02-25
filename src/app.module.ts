import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot( process.env.MONGO_URI, {
      // con esto se esta forzando a que la data la guarde en la base de datos auth-db y no en la test en este caso para el despliegue en railway
      dbName: process.env.MONGO_DB_NAME
    } ),

    AuthModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  constructor(){
    
    console.log(process.env.MONGO_URI);
  
  }
}
