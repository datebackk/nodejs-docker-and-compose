import { ClassConstructor } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';

export function toDto<T, V>(dto: ClassConstructor<T>, entity: V): T {
  return plainToInstance(dto, entity, { excludeExtraneousValues: true });
}
