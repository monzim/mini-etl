import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './drizzle/schema';

@Injectable()
export class DrizzleService {
  constructor() {}

  public async getDrizzle(url: string) {
    const pool = new Pool({
      connectionString: url,
    });

    return drizzle(pool, { schema });
  }
}
