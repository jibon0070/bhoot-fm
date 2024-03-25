FROM golang:alpine AS build
WORKDIR /build
COPY . .
RUN go build -o main .

FROM alpine
WORKDIR /app
COPY --from=build /build/. .
EXPOSE 9999
