import db from '../../db';

/**
 * A collection of worker methods tha handles event related to api.
 *
 * @class ApiWorker
 */
export default class ApiWorker {
  /**
     * Handles the tasks that should be carried out whenever an admin signs in.
     * @static
     * @memberof ApiWorker
     * @param { Object } job - The job object containing details of a .
     * @param { Function } done - The type of the job.
     * @returns { null } - It returns null.
     */
  static async saveNumberOfCallCount({ data }, done) {
    try {
      await db.none([data[0], data[1]]);
      done();
    } catch (e) {
      done(e);
    }
  }
}
