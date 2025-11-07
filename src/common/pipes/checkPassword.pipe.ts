import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { registerDTO } from 'src/auth/dto/register.dto';

@Injectable()
export class CheckPassword implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    value = 'checkpass';
    console.log('value in checkPassword pipe: ', value);
    return value;
  }
}
