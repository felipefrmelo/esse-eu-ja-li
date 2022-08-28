use uuid::Uuid;

pub struct User {
    id: String,
    pub email: String,
    pub password: String,
    pub name: String,
}

impl User {
    pub fn new(email: &str, password: &str, name: &str) -> Self {
        let id = Uuid::new_v4().to_string();

        Self {
            id,
            email: email.to_string(),
            password: password.to_string(),
            name: name.to_string(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn should_generate_a_uuid_for_new_users() {
        let user = User::new("test@test.com", "123456", "test");

        Uuid::parse_str(&user.id).expect("not is a valid a id");
    }
}
