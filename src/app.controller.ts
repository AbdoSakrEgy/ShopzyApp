import { Body, Controller, Get, Param, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
