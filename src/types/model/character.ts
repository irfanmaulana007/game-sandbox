import type { Characters, JobClasses } from './schema';

export interface CharacterWithJob extends Characters {
  job: JobClasses;
}
