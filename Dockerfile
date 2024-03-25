FROM golang:alpine AS build
WORKDIR /build
COPY . .
RUN go build -o main .
