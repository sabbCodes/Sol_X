use anchor_lang::prelude::*;

declare_id!("Wg8YBGqpNcnv4NWNFh9cYvNiDFjZ8ZPHtXrazTbizg2");

#[program]
pub mod sol_x {
    use super::*;

    pub fn send_tweet(ctx:Context<SentATweet>, topic:String, content:String) -> Result<()>{

        if topic.chars().count() > 50 {
            return err!(TweetErrors::TopicTooLong);
        }

        if content.chars().count() > 280 {
            return err!(TweetErrors::ContentTooLong);
        }

        let user_tweet = &mut ctx.accounts.user_tweet;
        let tweet_sender = &ctx.accounts.tweet_sender;
        let time = Clock::get().unwrap();

        user_tweet.author = *tweet_sender.key;
        user_tweet.timestamp = time.unix_timestamp;
        user_tweet.topic = topic;
        user_tweet.content = content;
        Ok(())
    }
}

#[error_code]
pub enum TweetErrors {
    #[msg("Tweet topic shouldn't be more than 50 characters")]
    TopicTooLong,

    #[msg("Tweet topic shouldn't be more than 50 characters")]
    ContentTooLong
}

#[derive(Accounts)]
pub struct SentATweet<'a> {
    #[account(init, payer=tweet_sender, space=TweetsOnBlockchain::LEN)]
    pub user_tweet: Account<'a, TweetsOnBlockchain>,

    #[account(mut)]
    pub tweet_sender: Signer<'a>,
    pub system_program: Program<'a, System>
}

#[account]
pub struct TweetsOnBlockchain {
    pub author: Pubkey,
    pub timestamp: i64,
    pub topic: String,
    pub content: String,
}

const DISCRIMINATOR: usize = 8;
const PUBKEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_PREFIX_LENGTH: usize = 4;
const MAX_TOPIC_LENGTH: usize = 50 * 4;
const MAX_CONTENT_LENGTH: usize = 280 * 4;


impl TweetsOnBlockchain {
    const LEN: usize = DISCRIMINATOR +
        PUBKEY_LENGTH + TIMESTAMP_LENGTH +
        STRING_PREFIX_LENGTH + MAX_TOPIC_LENGTH +
        STRING_PREFIX_LENGTH + MAX_CONTENT_LENGTH;
}