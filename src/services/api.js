import axios from 'axios';
import cfg from '../config/extra';

const api = axios.create({
  baseURL: `${cfg.apiBaseUrl}/api`,
  timeout: 8000,
});

// export async function getUser(email) {
//   const res = await api.get(`/user/${encodeURIComponent(email)}`);
//   return res.data;
// }
// export async function registerUser(email) {
//   const res = await api.post('/user/register', { email });
//   return res.data;
// }
// export async function subscribe(email) {
//   const res = await api.post(`/user/subscribe/${encodeURIComponent(email)}`);
//   return res.data;
// }



export const registerUser   = async (email) => (await api.post('/user/register', { email })).data;
export const getUser        = async (email) => (await api.get(`/user/${encodeURIComponent(email)}`)).data;
export const subscribeUser  = async (email) => (await api.post(`/user/subscribe/${encodeURIComponent(email)}`)).data;
