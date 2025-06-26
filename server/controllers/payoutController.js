const cashfree = require('../utils/cashfree');
const Payout = require('../models/Payout');

exports.submitPayout = async (req, res) => {
  const { amount, utr, method, upiId, account_number, ifsc, name } = req.body;
  const userId = req.user._id;
  const email = req.user.email || 'user@example.com';

  try {
    // 1. Add Beneficiary Payload
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

    // 2. Add Beneficiary
    const beneResponse = await cashfree.post('/payout/v1/addBeneficiary', benePayload);
    console.log('✅ Beneficiary Added:', beneResponse.data);

    // 3. Request Transfer
    const transfer = await cashfree.post('/payout/v1/requestTransfer', {
      beneId: userId.toString(),
      amount: parseInt(amount),
      transferId: utr,
      transferMode: method === 'upi' ? 'upi' : 'imps',
      remarks: 'SkillMint Payout'
    });

    console.log('📦 Transfer Response:', transfer.data);

    // 4. Handle Error Status from Cashfree
    if (transfer.data.status === 'ERROR') {
      return res.status(400).json({
        message: '❌ Payout Error',
        status: transfer.data.status,
        subCode: transfer.data.subCode,
        reason: transfer.data.message || transfer.data.reason
      });
    }

    // 5. Save to DB
    await Payout.create({
      user: userId,
      amount,
      utr,
      method,
      status: transfer.data.status,
      referenceId: transfer.data.referenceId || '',
    });

    // 6. Send Success Response
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

// ✅ Check Payout Status
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
