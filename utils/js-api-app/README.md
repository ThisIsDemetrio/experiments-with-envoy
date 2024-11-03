# js-api-app

Simple application with one single API endpoint:

- `/api`, GET, returns a  JSON object with the name of the app (as defined with the `APP_NAME` environment variable), the port and a return key with value `OK`.

## Requirements

- Node v22. If you use [`nvm`](https://github.com/nvm-sh/nvm) (or similar), you can install Node v22 with `nvm install`, then select it with `nvm use`.

## Environment variables

- `APP_NAME`: Name of the app. It will be included in the response.

## How to run locally

```bash
# Install dependencies
npm install

# Then
npm start
# or
node main.js
```

## How to run in Docker

First of all, build the image:

```bash
docker build -t <your-image-name> .
```

> TIP
> As long as you use the same image name (`-t`), you can override the image after every build

Then, run it specifying the port and the environment variables:
```bash
docker run --rm -p <your-port>:3000 -e APP_NAME=<your-app-name> js-api-app
```

> TIP
> Add `-d` to run it in detached mode.
