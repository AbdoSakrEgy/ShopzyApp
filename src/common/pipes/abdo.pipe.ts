import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class Abdo implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log('value in abdo pipe: ', value);
    return value;
  }
}
