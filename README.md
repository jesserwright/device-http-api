## Start with Docker
`docker compose build && docker compose up`

## curl requests

List All

`curl -v -X GET localhost:80/device`

Create

`curl -v -X POST localhost:80/device -H 'Content-Type: application/json' -d '{"type":"button","version":2,"description":"my desc 123"}'`

Update

`curl -v -X PUT localhost:80/device -H 'Content-Type: application/json' -d '{"id":"1","type":"button","version":2,"description":"hello world"}'`

Read One

`curl -v -X GET "localhost:80/device?id=1"`

Delete

`curl -v -X DELETE localhost:80/device -H 'Content-Type: application/json' -d '{"id":"1"}'`
