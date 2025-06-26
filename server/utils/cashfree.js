// utils/cashfree.js
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const BASE_URL =
  process.env.CASHFREE_PAYOUT_ENV === 'PROD'
    ? 'https://payout-api.cashfree.com'
    : 'https://payout-gamma.cashfree.com';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// 🔒 Store token in memory to avoid refetching on every request
let token = null;
let tokenExpiry = null;

// 🚀 Interceptor to inject token into every request
client.interceptors.request.use(async (config) => {
  const now = Date.now();

  // If token is not fetched yet or expired, get new one
  if (!token || now >= tokenExpiry) {
    try {
      const res = await axios.post(
        `${BASE_URL}/payout/v1/authorize`,
        qs.stringify({
          client_id: process.env.CASHFREE_PAYOUT_CLIENT_ID,
          client_secret: process.env.CASHFREE_PAYOUT_CLIENT_SECRET
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      token = res.data?.data?.token;

      if (!token) {
        console.error('❌ Failed to fetch Cashfree token:', res.data);
        throw new Error('Cashfree token is missing or invalid.');
      }

      // Set expiry 10 minutes from now (token valid for 15 minutes)
      tokenExpiry = now + 10 * 60 * 1000;

    } catch (err) {
      console.error('❌ Error while fetching Cashfree token:', err.response?.data || err.message);
      throw err;
    }
  }

  // Attach token to request
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

module.exports = client;
