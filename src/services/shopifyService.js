const axios = require('axios');

async function getOrderStatusFromShopify(orderId, shopifyToken, shopifyStore) {
  // shopifyStore: exemplo "nomedaloja.myshopify.com"
  const url = `https://${shopifyStore}/admin/api/2023-04/orders/${orderId}.json`;
  const headers = {
    "X-Shopify-Access-Token": shopifyToken
  };
  const { data } = await axios.get(url, { headers });
  return data.order.financial_status; // ou fulfillment_status, ou outros campos
}

module.exports = { getOrderStatusFromShopify };
