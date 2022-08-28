use pwhash::sha512_crypt;

pub fn verify(password: &str, password_hash: &str) -> bool {
    sha512_crypt::verify(password, password_hash)
}

pub fn hash(password: &str) -> String {
    sha512_crypt::hash(password).unwrap()
}
