import { Body, Controller, Get, Param, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @Req() req: Request,
    @Body() body: any,
    @Param() param: any,
    @Query() { name, age }: any,
  ): string {
    // console.log({ req });
    console.log({ body });
    console.log({ param });
    console.log({ name, age });

    return this.appService.getHello();
  }
}
