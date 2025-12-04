// server.js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 4000 });

wss.on('connection', (ws) => {
  console.log('✅ کاربر وصل شد');

  ws.send(JSON.stringify({
    type: 'NEW_SALE',
    payload: { day: 'شنبه', amount: Math.floor(Math.random() * 500000) }
  }));

  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      type: 'STOCK_UPDATE',
      payload: { name: 'محصول A', stock: Math.floor(Math.random() * 20) }
    }));
  }, 10000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('❌ اتصال بسته شد');
  });
});