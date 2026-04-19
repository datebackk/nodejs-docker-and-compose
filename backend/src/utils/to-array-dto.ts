import { ClassConstructor } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';

export function toArrayDto<T, V>(dto: ClassConstructor<T>, entities: V[]): T[] {
  return entities.map((entity) =>
    plainToInstance(dto, entity, { excludeExtraneousValues: true }),
  );
}
