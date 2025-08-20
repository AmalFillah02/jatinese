//frontend/src/lib/api.js

import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const authenticatedFetch = async (url, options = {}) => {
  const token = Cookies.get('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Di sinilah "kartu akses" (token) disertakan di setiap permintaan
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // ... sisa logika
  return response;
};

export default authenticatedFetch;