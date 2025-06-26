const cashfree = require('../utils/cashfree');
const Payout = require('../models/Payout');

exports.submitPayout = async (req, res) => {
  const { amount, utr, method, upiId, account_number, ifsc, name } = req.body;
  const userId = req.user._id;
  const email = req.user.email || 'user@example.com';

  try {
    const benePayload =
      method === 'upi'
        ? {
            beneId: userId.toString(),
            name,
            email,
            phone: '9999999999',
            upi: upiId
          }
        : {
            beneId: userId.toString(),
            name,
            email,
            phone: '9999999999',
            bankAccount: account_number,
            ifsc
          };

    const beneResponse = await cashfree.post('/payout/v1/addBeneficiary', benePayload);
    console.log('✅ Beneficiary Added:', beneResponse.data);

    const transfer = await cashfree.post('/payout/v1/requestTransfer', {
      beneId: userId.toString(),
      amount: parseInt(amount),
      transferId: utr,
      transferMode: method === 'upi' ? 'upi' : 'imps',
      remarks: 'SkillMint Payout'
    });

    console.log('📦 Transfer Response:', transfer.data);

    if (transfer.data.status === 'ERROR') {
      return res.status(400).json({
        message: '❌ Payout Error',
        status: transfer.data.status,
        subCode: transfer.data.subCode,
        reason: transfer.data.message || transfer.data.reason
      });
    }

    await Payout.create({
      user: userId,
      amount,
      utr,
      method,
      status: transfer.data.status,
      referenceId: transfer.data.referenceId || '',
    });

    res.json({
      message: '✅ Payout Initiated',
      status: transfer.data.status,
      referenceId: transfer.data.referenceId
    });

  } catch (err) {
    console.error('❌ Cashfree Error:', err.response?.data || err.message);
    res.status(500).json({
      message: '❌ Payout failed',
      error: err.response?.data || err.message
    });
  }
};

exports.checkPayoutStatus = async (req, res) => {
  const { utr } = req.params;

  try {
    const response = await cashfree.get(`/payout/v1/getTransferStatus?transferId=${utr}`);
    res.json(response.data);
  } catch (err) {
    console.error('❌ Payout Status Error:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to check status',
      error: err.response?.data || err.message
    });
  }
};
