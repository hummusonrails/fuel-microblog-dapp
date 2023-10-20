library;

/// Data struct for a post
pub struct Post {
    id: u64,
    content: str[280],
    author: Identity,
}

impl Post {
    /// Creates a new post with the given content
    pub fn new(id: u64, content: str[280], author: Identity) -> Self {
        Self {
            id, 
            content, 
            author 
        }
    }
}