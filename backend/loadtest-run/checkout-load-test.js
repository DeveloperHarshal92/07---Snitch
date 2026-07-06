import http from "k6/http";
import { check, fail } from "k6";

const BASE_URL = "http://localhost:3000";
const productIds = JSON.parse(open("./seeded-product-ids.json"));

export const options = {
  vus: 20,
  duration: "30s",
};

export function setup() {
  const loginResponse = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: "test@example.com",
      password: "test@123",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const loginPassed = check(loginResponse, {
    "login returned HTTP 200": (response) => response.status === 200,
    "login returned success:true": (response) => {
      try {
        return response.json("success") === true;
      } catch {
        return false;
      }
    },
    "login returned token cookie": (response) =>
      Boolean(response.cookies.token?.[0]?.value),
  });

  if (!loginPassed) {
    fail(
      `Login failed: status=${loginResponse.status} body=${loginResponse.body}`,
    );
  }

  return {
    cookie: `token=${loginResponse.cookies.token[0].value}`,
  };
}

export default function (data) {
  const productId =
    productIds[Math.floor(Math.random() * productIds.length)];
  const response = http.post(
    `${BASE_URL}/api/cart/add/${productId}`,
    JSON.stringify({ quantity: 1 }),
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: data.cookie,
      },
    },
  );

  check(response, {
    "cart add returned HTTP 200": (result) => result.status === 200,
  });

  if (response.status !== 200) {
    console.error(
      `FAILED_REQUEST status=${response.status} body=${response.body}`,
    );
  }
}
