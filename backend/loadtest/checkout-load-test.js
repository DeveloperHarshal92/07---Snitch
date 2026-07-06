import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
};

const BASE_URL = 'http://localhost:3000/api';
const PRODUCT_IDS = JSON.parse(open('./seeded-product-ids.json'));
const LOGIN_PAYLOAD = {
  email: 'test@example.com',
  password: 'test@123',
};

export function setup() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify(LOGIN_PAYLOAD),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const setCookieHeader = res.headers['Set-Cookie'];
  if (!setCookieHeader) {
    throw new Error(`Login did not return Set-Cookie. Status: ${res.status} Body: ${res.body}`);
  }

  console.log(`Login status: ${res.status}`);
  return { cookie: setCookieHeader };
}

export default function (data) {
  const productId = PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)];
  const res = http.post(
    `${BASE_URL}/cart/add/${productId}`,
    JSON.stringify({ quantity: 1 }),
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: data.cookie,
      },
    },
  );

  if (res.status !== 200) {
    console.log(`FAIL ${res.status}: ${res.body}`);
  }

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}