import { HttpService, serializeParams } from '@/casimir-framework/services/Http';
import { makeSingletonInstance } from '@/casimir-framework/all';

export class UserHttp {
  http = HttpService.getInstance();

  /**
   * Create NFT item
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async createUser(req) {
    return this.http.post('/api/v3/users', req.getHttpBody(), {
      headers: req.getHttpHeaders()
    });
  }

/**
 * Update user information
 * @param {Object} req
 * @return {Promise<Object>}
 */
  async update(req) {
    return this.http.put(
      '/api/v2/user/update',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
 * Change user password
 * @param {Object} req
 * @return {Promise<Object>}
 */
  changePassword(req) {
    return this.http.put(
      '/api/v2/user/update/password',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
 * Get users by several ids
 * @param {string[]} usernames
 * @return {Promise<Object>}
 */
  async getListByIds(usernames) {
    const query = serializeParams({ usernames });
    return this.http.get(`/api/v2/users?${query}`);
  }

  /**
 * Get users by team id
 * @param {string} teamId
 * @return {Promise<Object>}
 */
  async getListByTeam(teamId) {
    return this.http.get(`/api/v2/users/team/${teamId}`);
  }

  /**
 * Get users by portal id
 * @param {string} portalId
 * @return {Promise<Object>}
 */
  async getListByPortal(portalId) {
    return this.http.get(`/api/v2/users/portal/${portalId}`);
  }

  /**
 * Get users by several parameters
 * @param {Object} params
 * @return {Promise<Object>}
 */
  async getList(params) {
    const query = serializeParams(params);
    return this.http.get(`/api/v2/users/listing?${query}`);
  }

  /**
 * Get user by given _id
 * @param {string} _id
 * @return {Promise<Object>}
 */
  async getOne(_id) {
    return this.http.get(`/api/v2/user/name/${_id}`);
  }

  /**
 * Get user by given email
 * @param {string} email
 * @return {Promise<Object>}
 */
  async getOneByEmail(email) {
    return this.http.get(`/api/v2/user/email/${email}`);
  }

  /** @type {() => UserHttp} */
  static getInstance = makeSingletonInstance(() => new UserHttp());
}
