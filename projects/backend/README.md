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

## start the deno backend
`deno task start` or `deno task dev` for watch mode
