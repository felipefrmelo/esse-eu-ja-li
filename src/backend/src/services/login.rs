pub use crate::adapters::{password_hash, user_repository::UserRepositoryInMemory};
pub use crate::domain::{token::Token, user::User};

pub trait UserRepository {
    fn new(users: Vec<User>) -> Self;
    fn find_user_by_email(&self, email: &str) -> Option<&User>;
}

pub fn handle(
    email: &str,
    password: &str,
    generate_token: fn(id: &str, name: &str) -> String,
    repo: &impl UserRepository,
) -> Result<Token, LoginError> {
    let user = repo.find_user_by_email(email);

    let user = check_user(user)?;

    check_password(password, &user.password)?;

    Ok(Token {
        access_token: generate_token(&user.id, &user.name),
        name: user.name.to_string(),
    })
}

#[derive(PartialEq, Debug)]
pub enum LoginError {
    InvalidCrendetias,
}

fn check_user(user_opt: Option<&User>) -> Result<&User, LoginError> {
    if user_opt.is_none() {
        return Err(LoginError::InvalidCrendetias);
    }

    Ok(user_opt.unwrap())
}

fn check_password(password: &str, password_hash: &str) -> Result<(), LoginError> {
    if !password_hash::verify(password, password_hash) {
        return Err(LoginError::InvalidCrendetias);
    }
    Ok(())
}

#[cfg(test)]
mod tests_services {

    use super::*;

    fn generate_token(_id: &str, _name: &str) -> String {
        String::from("test_token")
    }

    fn make_fake_user() -> (&'static str, &'static str, User) {
        let email = "test@test.com";
        let password = "1234566";
        let password_hashed = &password_hash::hash(password);
        let name = "test";
        let user = User::new(email, password_hashed, name);

        (email, password, user)
    }

    #[test]
    fn should_create_a_token_when_give_a_valid_credentials() {
        let token_expected = Token {
            access_token: generate_token("", ""),
            name: "test".to_string(),
        };

        let (email, password, user) = make_fake_user();

        let repo = UserRepositoryInMemory::new(vec![user]);

        let token = handle(email, password, generate_token, &repo).expect("token should be valid");

        assert_eq!(token, token_expected);
    }

    #[test]
    fn should_return_a_error_if_password_is_wrong() {
        let (email, _, user) = make_fake_user();
        let password = "wrongpassword";

        let repo = UserRepositoryInMemory::new(vec![user]);

        let token = handle(email, password, generate_token, &repo);

        assert_eq!(token, Err(LoginError::InvalidCrendetias));
    }

    #[test]
    fn should_return_a_error_if_user_not_exits() {
        let email = "notexist@test.com";
        let password = "1234566";

        let repo = UserRepositoryInMemory::new(vec![]);

        let token = handle(email, password, generate_token, &repo);

        assert_eq!(token, Err(LoginError::InvalidCrendetias));
    }
}
