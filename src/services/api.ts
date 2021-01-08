import axios from 'axios';

const baseURL = 'https://cs-demo-api.herokuapp.com';

export const client = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});
