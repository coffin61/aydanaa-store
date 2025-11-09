import Kavenegar from 'kavenegar';

const api = Kavenegar.KavenegarApi({
  apikey: process.env.KAVENEGAR_API_KEY,
});

export default api;