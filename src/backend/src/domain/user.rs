pub struct User {
    pub id: String,
    pub email: String,
    pub password: String,
    pub name: String,
}

impl User {
    pub fn new(email: &str, password: &str, name: &str) -> Self {
        let id = "624e254b-af5d-4012-986b-5bafdec3a370".to_string();
        Self {
            id,
            email: email.to_string(),
            password: password.to_string(),
            name: name.to_string(),
        }
    }
}
