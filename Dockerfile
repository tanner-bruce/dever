FROM golang:1.11
WORKDIR /src
COPY . .
RUN go get ./... && CGO_ENABLED=0 go build -o /dever ./cmd/dever

FROM alpine:edge
COPY --from=0 /dever /dever
RUN apk add --update --no-cache git
EXPOSE 8735
ENV HOME /home
VOLUME /home/src
VOLUME /home/.ssh
ENTRYPOINT ["/dever"]