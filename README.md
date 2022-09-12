[![build](https://github.com/jahid90-cloud/meeves/actions/workflows/build.yml/badge.svg)](https://github.com/jahid90-cloud/meeves/actions/workflows/build.yml)

# Meeves

Meeves is an in-MEmory EVEnt Store

## APIs

```
- GET /ping
- POST /events
- GET /events
- GET /events/stream/:streamName
- GET /events/stream/:streamName/last
- GET /events/type/:type
- GET /events/:id
```

### TODO

- Support multiple in-memory stores
- Add feature to provide store name during request to query specific in-memory store
