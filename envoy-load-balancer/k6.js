import http from 'k6/http';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'
import { check, sleep } from 'k6';

/**
 * 10 concurrent users calls the same API for 30 seconds, with pauses of 1 milliseconds.
 * 
 * TODO
 * 
 */

const results = {}

export const options = {
    vus: 5,
    duration: '30s',
    thresholds: {
        checks: ['rate==0.9'],
    },
}

export default function () {
    const res = http.get(`http://envoy:8081/`)

    check(res, { 'is 200': (r) => r.status === 200 });

    let appName;
    try {
        // Extract the appName from the response
        const responseBody = JSON.parse(res.body);
        appName = responseBody.appName;
    } catch (e) {
        console.error('Failed to parse response body:', e);
        return;
    }

    // Apply the appName to the dictionary
    if (!!results[appName]) results[appName] += 1
    else results[appName] = 1

    // After each call, we check that the Envoy is balancing calls between services
    check(res, {
        'is load balancing': () => {
            const counts = Object.values(results);
            const maxCount = Math.max(...counts);
            const minCount = Math.min(...counts);

            // We avoid to check the value in case there are too few calls
            if (maxCount < 10) return true

            return maxCount - minCount <= (maxCount * 0.2)
        }
    })
    sleep(0.01);
}

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: '->', enableColors: true }),
    }
}