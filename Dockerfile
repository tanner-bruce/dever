FROM golang:1.12
WORKDIR /src
COPY go.mod .
COPY go.sum .
RUN go get ./... && env CGO_ENABLED=0 go build -o /dever ./cmd/dever
COPY . .

FROM alpine:edge
COPY --from=0 /dever /dever
RUN apk add --update --no-cache git
EXPOSE 8735
ENV HOME /home
VOLUME /home/src
VOLUME /home/.ssh
ENTRYPOINT ["/dever"]