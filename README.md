## Start with Docker
`docker compose build && docker compose up`

## Open in browser
[http://localhost:80](http://localhost:80) (assuming default Docker configuration)

## Test with `curl`

Create

```
curl -v -X POST localhost:80/device \
-H 'Content-Type: application/json' \
-d '{"type":"BIO-BUTTON-RDX","version":"2432","description":"A medical grade wearable patient monitor device"}'
```

Update

```
curl -v -X PUT localhost:80/device \
-H 'Content-Type: application/json' \
-d '{"id":"1","type":"BIO-BUTTON-TNQ","version":3204,"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa."}'
```

Read One

```
curl -v -X GET "localhost:80/device?id=1"
```

Read All

```
curl -v -X GET localhost:80/device
```


Delete

```
curl -v -X DELETE localhost:80/device \
-H 'Content-Type: application/json' \
-d '{"id":"1"}'
```
