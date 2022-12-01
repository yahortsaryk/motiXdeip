import { proxydi } from '@/casimir-framework/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@/casimir-framework/messages';
import {
  CreateUserCmd,
  UpdateDaoCmd,
  AlterDaoAuthorityCmd
} from '@/casimir-framework/commands';
// import { ChainService } from '@casimir.one/chain-service';
import { WebSocketService } from '@/casimir-framework/services/WebSocket';
import {
  replaceFileWithName,
  createFormData,
  genSha256Hash,
  makeSingletonInstance
} from '@/casimir-framework/all';
// import { APP_EVENT } from '@/casimir-framework/all';
// import { walletSignTx } from '@casimir.one/platform-util';
import { UserHttp } from './UserHttp';

export class UserService {
  userHttp = UserHttp.getInstance();
  webSocketService = WebSocketService.getInstance();

  proxydi = proxydi;


  /**
   * Create new user
   * @param {Object} initiator
   * @param {Object} userData
   * @return {Promise<Object>}
   */
  async createUser(keyPair, userData) {
    const privKey = keyPair.getPrivKey();
    
    const {
      email,
      pubKey,
      roles,
      attributes,
    } = userData;

    const cmd = new CreateUserCmd({
      email,
      pubKey,
      roles,
      attributes,
    });

    const msg = new JsonDataMsg({
      appCmds: [cmd]
    });

    return this.userHttp.createUser(msg);
  }

  /**
   * Update user information
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator._id
   * @param {string} payload.email
   * @param {number} payload.status
   * @param {Object[]} payload.attributes
   * @return {Promise<Object>}
   */
  async update(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        _id: updater
      },
      ...data
    } = payload;

    const {
      email,
      status
    } = data;

    const formData = createFormData(data);
    const attributes = replaceFileWithName(data.attributes);

    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();

    const txBuilder = await chainTxBuilder.begin();

    const updateDaoCmd = new UpdateDaoCmd({
      isTeamAccount: false,
      _id: updater,
      description: genSha256Hash(attributes),
      attributes,
      email,
      status
    });

    txBuilder.addCmd(updateDaoCmd);

    const packedTx = await txBuilder.end();

    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new MultFormDataMsg(
      formData,
      signedTx.getPayload(),
      { 'entity-id': updater }
    );

    if (env.RETURN_MSG === true) {
      return msg;
    }

    const response = await this.userHttp.update(msg);

    // await this.webSocketService.waitForMessage((message) => {
    //   const [, eventBody] = message;
    //   return eventBody.event.eventNum === APP_EVENT.DAO_UPDATED
    //           && eventBody.event.eventPayload.daoId === updater;
    // });

    return response;
  }

  /**
   * Change user password
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator._id
   * @param {Object} payload.authority
   * @return {Promise<Object>}
   */
  async changePassword(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        _id
      },
      authority
    } = payload;

    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();

    const txBuilder = await chainTxBuilder.begin();

    const alterDaoAuthorityCmd = new AlterDaoAuthorityCmd({
      _id: _id,
      isTeamAccount: false,
      authority
    });

    txBuilder.addCmd(alterDaoAuthorityCmd);

    const packedTx = await txBuilder.end();

    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload(), { 'entity-id': _id });

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.userHttp.changePassword(msg);
  }

  /**
   * Get users by ids
   * @param {string[]} ids
   * @return {Promise<Object>}
   */
  async getListByIds(ids) {
    return this.userHttp.getListByIds(ids);
  }

  /**
   * Get users by team id
   * @param {string} teamId
   * @return {Promise<Object>}
   */
  async getListByTeam(teamId) {
    return this.userHttp.getListByTeam(teamId);
  }

  /**
   * Get users by portal id
   * @param {string} portalId
   * @return {Promise<Object>}
   */
  async getListByPortal(portalId) {
    return this.userHttp.getListByPortal(portalId);
  }

  /**
   * Get users by several parameters
   * @param {Object} query
   * @return {Promise<Object>}
   */
  async getList(query = {}) {
    return this.userHttp.getList(query);
  }

  /**
   * Get user by _id or email
   * @param {string} _id
   * @return {Promise<Object>}
   */
  async getOne(_id) {
    if (_id.includes('@')) {
      return this.userHttp.getOneByEmail(_id);
    }
    return this.userHttp.getOne(_id);
  }

  /** @type {() => UserService} */
  static getInstance = makeSingletonInstance(() => new UserService());
}
