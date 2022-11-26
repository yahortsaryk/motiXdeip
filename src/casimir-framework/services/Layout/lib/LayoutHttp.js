import { HttpService } from '@/casimir-framework/services/Http';
import { makeSingletonInstance } from '@/casimir-framework/all';

/**
 * Layouts HTTP transport
 */
export class LayoutHttp {
  http = HttpService.getInstance();

  /**
   * Get layout
   * @param {string} layoutId
   * @returns {Promise<Object>}
   */
  async getLayout(layoutId) {
    return this.http.get(`/api/v2/layout/${layoutId}`);
  }

  /**
   * Get layouts
   * @returns {Promise<Object>}
   */
  async getLayouts() {
    return this.http.get('/api/v2/layouts');
  }

  /**
   * Get layouts by scope
   * @param {string} scope
   * @returns {Promise<Object>}
   */
  async getLayoutsByScope(scope) {
    return this.http.get(`/api/v2/layouts/scope/${scope}`);
  }

  /**
   * Create layout
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async createLayout(req) {
    return this.http.post('/api/v2/layout', req.getHttpBody());
  }

  /**
   * Update layout
   * @param {Object} req
   */
  async updateLayout(req) {
    return this.http.put('/api/v2/layout', req.getHttpBody());
  }

  /**
   * Delete layout
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async deleteLayout(req) {
    return this.http.put('/api/v2/layout/delete', req.getHttpBody());
  }

  /**
   * Get layouts settings
   * @returns {Promise<Object>}
   */
  async getMappings() {
    return this.http.get('/portal/settings/layout-mappings');
  }

  /**
   * Update settings
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async updateMappings(req) {
    return this.http.put('/portal/settings/layout-mappings', req.getHttpBody());
  }

  /** @type {() => LayoutHttp} */
  static getInstance = makeSingletonInstance(() => new LayoutHttp());
}
