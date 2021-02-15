/** @module orm */
import  { ConnectionOptions, createConnection, EntitySchema } from 'typeorm';

/**
 * connect to database
 * @deprecated
 * @param {EntitySchema[]} entities model entitites schemas
 * @param {*} config additional [`typeorm`](https://typeorm.io) connection config
 *
 * @example
 * // initiate database connection
 * async function init() {
 *  await connect([MySchema], {
 *    type: 'postgres',
 *    host: 'localhost',
 *    port: 5432,
 *    username: 'postgres',
 *    password: 'postgres',
 *    database:
 *    'sanbercode1',
 *  });
 * }
 */
export function connect(entities: EntitySchema[], config: ConnectionOptions) {
  return createConnection({
    ...config,
    synchronize: true,
    entities,
  });
}
