FROM rust:1.63

WORKDIR /usr/src/app
COPY . .

RUN cargo install --path .

CMD ["backend"]
