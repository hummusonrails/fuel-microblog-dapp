contract;

mod data_structures;
mod interface;

use std::{
    auth::msg_sender,
    hash::Hash,
    storage::storage_vec::*,
};

use ::data_structures::{
    post::Post,
};

use ::interface::{
    Blog,
};

storage {
    posts: StorageMap<u64, Post> = StorageMap::<u64, Post> {},
    num_posts: u64 = 0,
    user: Option<Identity> = Option::None,
}

impl Blog for Contract {
    #[storage(read, write)]
    fn post(content: str[280]) {
        let current_number_of_posts = storage.num_posts.try_read().unwrap();

        let new_post: Post = Post::new(
            current_number_of_posts,
            content,
            msg_sender().unwrap(),
        );

        storage.posts.insert(current_number_of_posts, new_post);

        let incremented_number_of_posts = current_number_of_posts + 1;
        storage.num_posts.write(incremented_number_of_posts);
    }

    #[storage(read)]
    fn get_posts_by_author() -> Vec<Post> {
        let mut posts = Vec::new();
        let author = msg_sender().unwrap();

        let mut i = 0;
        while i < storage.num_posts.try_read().unwrap() {
            let post = storage.posts.get(i).try_read().unwrap();
            if post.author == author {
                posts.push(post);
            }
            i += 1;
        }

        posts
    }

    #[storage(read, write)]
    fn initialize_user() -> Identity {
        let user = storage.user.try_read().unwrap();
        // make sure the user has NOT already been initialized
        require(user.is_none(), "user already initialized");
        // get the identity of the sender
        let sender = msg_sender().unwrap(); 
        // set the user to the sender's identity
        storage.user.write(Option::Some(sender));
        // return the user
        sender
    }

    #[storage(read)]
    fn get_num_posts() -> u64 {
        storage.num_posts.read()
    }

    #[storage(read)]
    fn get_post(post_id: u64) -> Post{
        storage.posts.get(post_id).try_read().unwrap()
    }
}