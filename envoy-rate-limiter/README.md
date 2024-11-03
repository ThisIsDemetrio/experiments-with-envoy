# Example of Rate Limiting with Envoy

Small example of rate limiting with Envoy. It can be executed by running the [`docker-compose.yml`](docker-compose.yml) file that includes the following three services:

- [js-api-app](../utils/js-api-app/README.md) as application to have APIs
- [Envoy](https://www.envoyproxy.io/) v1.30.0 as a reverse proxy and rate limiter (the configuration is in [envoy.yaml](envoy.yaml))
- [k6](https://k6.io/) v0.54.0 as a load testing tool (the script is in [k6.js](k6.js))

## How it works

The following is to try to understand how Envoy [rate limiting on routes](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/rate_limit_filter) works. 

The example has been set up to have Envoy as a reverse proxy for a small API application (`js-api-app`) that has only one endpoint (`/api`, that returns a JSON object with some simple metadata), with the route configured to allow to receive only 2 requests per second. If, during the span of a single second, more than 2 requests are received, the request is rejected with a _429 Too Many Requests_ status code.

_K6_ is used to send requests to the API application: we simulate an user that sends 5 requests at the same time, each second for 10 seconds. Since the rate limit is 2 requests per second, we expect that 2 requests are allowed and 3 are rejected.

The following diagram shows a representation of the flow of the requests:

```mermaid
graph TD;
    A[Requests to envoy:8081] -->|Forwards| B[Forwarded to js-api-app:4400/api]
    B -->|Rate limit: 2 requests/second| C[Responses to Clients]
    A -->|429 Too Many Requests| D[Rate Limit Exceeded]
    
    style A fill:#f9f,color:#001,stroke:#333,stroke-width:2px;
    style B fill:#bbf,color:#001,stroke:#333,stroke-width:2px;
    style C fill:#bbf,color:#001,stroke:#333,stroke-width:2px;
    style D fill:#f99,color:#001,stroke:#333,stroke-width:2px;
```

## How to run it

There's a [docker-compose.yml](docker-compose.yml) file that can be used to run all the services. Can be easily run with the following command from this very folder:

```bash
docker-compose up
```

The test does not print anything, it is up to you to check what happens. You can run also run it in detach mode, and after check that k6 has completed its execution and returned the responses with `docker compose logs <k6-container-id>` (with _k6-container-id_ being the identifier of the k6 container).