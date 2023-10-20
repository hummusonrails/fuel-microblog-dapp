library;

use ::data_structures::{
    post::Post,
};

use std::storage::storage_vec::*;

abi Blog {
    #[storage(read, write)]
    fn post(content: str[280]);

    #[storage(read)]
    fn get_posts_by_author() -> Vec<Post>;

    #[storage(read, write)]
    fn initialize_user() -> Identity;

    #[storage(read)]
    fn get_num_posts() -> u64;

    #[storage(read)]
    fn get_post(post_id: u64) -> Post;
}