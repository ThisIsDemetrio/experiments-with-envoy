import http from 'k6/http';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'
import { check, sleep } from 'k6';

/**
 * 1 concurrent users calls the same API 5 times, for 10 seconds.
 * 
 * We need to verify that the rate limiter is working, therefore some requests should return 200 and some 429.
 * 
 * Considering that the Envoy rate limiter is configured to allow 2 requests per second, we do expect the first two 
 * requests to have a 200 response, and the remaining of the requests to have a 429 response.
 * 
 */

export const options = {
    vus: 1,
    duration: '10s',
    thresholds: {
        checks: ['rate==1'],
    },
}

export default function () {
    const first = http.get(`http://envoy:8081/`)
    const second = http.get(`http://envoy:8081/`)
    const third = http.get(`http://envoy:8081/`)
    const fourth = http.get(`http://envoy:8081/`)
    const fifth = http.get(`http://envoy:8081/`)

    // First two requestss should be 200
    check(first, { 'is 200': (r) => r.status === 200 });
    check(second, { 'is 200': (r) => r.status === 200 });
    // The next three should be 429
    check(third, { 'is 429': (r) => r.status === 429 });
    check(fourth, { 'is 429': (r) => r.status === 429 });
    check(fifth, { 'is 429': (r) => r.status === 429 });

    // Sleep for a short period to simulate user wait time
    sleep(1);
}

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: '->', enableColors: true }),
    }
}