# Multi-stage production build for EVOS Go Backend
FROM golang:1.22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git ca-certificates tzdata

COPY go.mod go.sum* ./
RUN go mod download || true

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o evos-server ./cmd/server

# Final minimal scratch-based production container
FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/evos-server /app/evos-server
COPY --from=builder /app/db/migrations /app/db/migrations

# Non-root user for security
RUN adduser -D -u 10001 evosuser
USER evosuser

EXPOSE 8080

ENTRYPOINT ["/app/evos-server"]
