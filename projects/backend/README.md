## start the database
start redis database with:
`docker start redis`

or this if the image does not exist:
`docker run --name redis -p 6379:6379 -d redis`

## redis shell
to connect to the db inside the container:
`docker exec -it redis redis-cli`

in the shell, do any of the following
- `hget pokemon:[id] votes`
- `hgetall pokemon:[id]`

## ENV vars
The Deno program requires the following two env vars to be set:
`REDISHOST` & `REDISPORT`
Optional:
`REDISUSER` & `REDISPASSWORD`

To load the `.env` file that is available in this repository, run `. ./.env` in your terminal session.

## start the deno backend
`deno task start` or `deno task dev` for watch mode
