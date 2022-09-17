mod adapters;
mod domain;
mod entrypoint;
mod services;

pub use crate::services::login;

pub use crate::domain::user;

fn main() {

    entrypoint::actix::main().unwrap();
}
