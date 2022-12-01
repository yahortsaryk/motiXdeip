import { APP_CMD } from '@/casimir-framework/vars';
import { assert } from '@/casimir-framework/all';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Accept proposal command
 * @extends ProtocolCmd
 */
class AcceptProposalCmd extends ProtocolCmd {
  /**
   * Create command for accepting proposal
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {string} cmdPayload.account
   */
  constructor(cmdPayload) {
    const {
      // onchain
      _id,
      account,
      batchWeight
    } = cmdPayload;

    assert(!!_id, "'_id' is required");
    assert(!!account, "'account' is required");
    assert(!!batchWeight || batchWeight === 0, "'batchWeight' is required");

    super(APP_CMD.ACCEPT_PROPOSAL, cmdPayload);
  }
}

export default AcceptProposalCmd;
