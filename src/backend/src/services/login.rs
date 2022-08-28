pub use crate::domain::{token::Token, user::User};

trait UserRepository {
    fn findUserByEmail(&self, email: &str) -> Option<&User>;
    fn new() -> Self;
}

#[derive(PartialEq, Debug)]
enum LoginError {
    InvalidCrendetias,
}

fn handle(
    email: &str,
    password: &str,
    generate_token: fn(id: &str) -> String,
    repo: impl UserRepository,
) -> Result<Token, LoginError> {
    let user: Option<&User> = repo.findUserByEmail(email);

    if user.is_none() {
        return Err(LoginError::InvalidCrendetias);
    }

    Ok(Token {
        access_token: generate_token("id"),
    })
}

struct UserRepositoryInMemory {
    users: Vec<User>,
}

impl UserRepository for UserRepositoryInMemory {
    fn findUserByEmail(&self, email: &str) -> Option<&User> {
        self.users
            .iter()
            .find(|user| user.email == email.to_string())
    }

    fn new() -> Self {
        let user = User {
            id: String::from("a64f634a-5b2c-4c0a-9fc3-cd448fedc5b0"),
            email: String::from("test@test.com"),
            password: String::from("1234566"),
            name: String::from("test"),
        };

        let users: Vec<User> = vec![user];
        Self { users }
    }
}

#[cfg(test)]
mod tests_services {

    use super::*;

    #[test]
    fn should_create_a_token_when_give_a_valid_credentials() {
        let token_expected = Token {
            access_token: "test_token".to_string(),
        };

        let email = "test@test.com";
        let password = "1234566";

        let generate_token = |id: &str| String::from("test_token");
        let repo = UserRepositoryInMemory::new();

        let token = handle(email, password, generate_token, repo).expect("token should be valid");

        assert_eq!(token, token_expected);
    }

    #[test]
    fn should_return_a_error_if_user_not_exits() {
        let email = "notexist@test.com";
        let password = "1234566";

        let generate_token = |id: &str| String::from("test_token");

        let repo = UserRepositoryInMemory::new();

        let token = handle(email, password, generate_token, repo);

        assert_eq!(token, Err(LoginError::InvalidCrendetias));
    }
}
