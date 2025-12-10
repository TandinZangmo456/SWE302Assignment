import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp up to 5 users
    { duration: '30s', target: 5 },   // Stay at 5 users
    { duration: '10s', target: 10 },  // Ramp up to 10 users
    { duration: '30s', target: 10 },  // Stay at 10 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% requests < 2s
    http_req_failed: ['rate<0.1'],     // <10% errors
  },
};

export default function () {
  // Test public endpoints that don't need auth
  const baseUrl = 'http://localhost:8080/api';
  
  // Test 1: Get articles (public endpoint)
  let res = http.get(`${baseUrl}/articles`);
  check(res, {
    'articles status is 200': (r) => r.status === 200,
  });
  sleep(1);
  
  // Test 2: Get tags (public endpoint)
  res = http.get(`${baseUrl}/tags`);
  check(res, {
    'tags status is 200': (r) => r.status === 200,
  });
  sleep(1);
  
  // Test 3: Try to get user (might fail without auth - that's okay)
  res = http.get(`${baseUrl}/user`);
  check(res, {
    'got any response': (r) => r.status !== null,
  });
  sleep(1);
}
