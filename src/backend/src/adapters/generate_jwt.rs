use chrono::{Duration, UTC};
use jsonwebtoken::{encode as jwt_encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    name: String,
}

pub fn encode(id: &str, name: &str) -> String {
    let key = b"secret";

    let my_claims = Claims {
        sub: id.to_owned(),
        exp: (UTC::now() + Duration::days(1)).timestamp() as usize,
        name: name.to_owned(),
    };
    let token = match jwt_encode(
        &Header::default(),
        &my_claims,
        &EncodingKey::from_secret(key),
    ) {
        Ok(t) => t,
        Err(_) => panic!(),
    };
    token
}
