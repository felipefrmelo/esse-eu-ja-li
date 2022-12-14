use jsonwebtoken::{encode as jwt_encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub fn encode(id: &str) -> String {
    let key = b"secret";
    let my_claims = Claims {
        sub: id.to_owned(),
        exp: 100000000,
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
