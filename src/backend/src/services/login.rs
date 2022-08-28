pub use crate::domain::{token::Token, user::User};
pub use crate::infra::user_repository::UserRepositoryInMemory;

pub trait UserRepository {
    fn find_user_by_email(&self, email: &str) -> Option<&User>;
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
    let user: Option<&User> = repo.find_user_by_email(email);

    if user.is_none() {
        return Err(LoginError::InvalidCrendetias);
    }

    Ok(Token {
        access_token: generate_token("id"),
    })
}

#[cfg(test)]
mod tests_services {

    use super::*;

    fn generate_token(_id: &str) -> String {
        String::from("test_token")
    }

    #[test]
    fn should_create_a_token_when_give_a_valid_credentials() {
        let token_expected = Token {
            access_token: "test_token".to_string(),
        };

        let email = "test@test.com";
        let password = "1234566";

        let repo = UserRepositoryInMemory::new();

        let token = handle(email, password, generate_token, repo).expect("token should be valid");

        assert_eq!(token, token_expected);
    }

    #[test]
    fn should_return_a_error_if_user_not_exits() {
        let email = "notexist@test.com";
        let password = "1234566";

        let repo = UserRepositoryInMemory::new();

        let token = handle(email, password, generate_token, repo);

        assert_eq!(token, Err(LoginError::InvalidCrendetias));
    }
}
