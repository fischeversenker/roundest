# Roundest Backend
This is the Roundest Backend for the Roundest Frontend.

It runs on Deno and uses the `oak` middleware framework.

## Local development
### Start the Server
Run
```sh
deno task start
```
to start the server, or
```sh
deno task dev
```
to start the server in watch mode

#### ⚠️ ENV vars
The server requires the following two env vars to be set: `REDISHOST` & `REDISPORT`\
Depending on the Redis you want to connect to, you also need to specify these two optional vars: `REDISUSER` & `REDISPASSWORD`

To load the `.env` file that is available in this repository, run `. ./.env` in your terminal session before you start the server.

### Start the Database
You can start a local Redis instance in a Docker container with this command:
```sh
docker run --name redis -p 6379:6379 -d redis
```

To connect to Redis inside the container:
```sh
docker exec -it redis redis-cli
```

In the Redis shell, do any of the following
- `hget pokemon:[id] votes`
- `hgetall pokemon:[id]`
