import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '5m', target: 10 },   // 5 minutes soak (instead of 3 hours)
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:8080/api/articles');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(3); // Simulate user thinking time
}
