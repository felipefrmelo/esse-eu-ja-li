use crate::domain::user::User;
use crate::services::login::UserRepository;

pub struct UserRepositoryInMemory {
    users: Vec<User>,
}

impl UserRepository for UserRepositoryInMemory {
    fn find_user_by_email(&self, email: &str) -> Option<&User> {
        self.users
            .iter()
            .find(|user| user.email == email.to_string())
    }

    fn new(users: Vec<User>) -> Self {
        Self { users }
    }
}

impl UserRepositoryInMemory {}
