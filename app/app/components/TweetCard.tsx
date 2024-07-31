import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";

const TweetCard = (props: any) => {
    const tweet = props.tweet;

    // Add checks to ensure properties exist
    const tweetPubkey = tweet?.publickey ? tweet.publickey.toBase58() : "Unknown";
    const author = tweet?.account?.author ? new PublicKey(tweet.account.author) : undefined;
    const timestamp = tweet?.account?.timestamp || 0;
    const topic = tweet?.account?.topic || "Missing topic";
    const content = tweet?.account?.content || "Missing content";

    const href = `https://explorer.solana.com/address/${tweetPubkey}?cluster=devnet`;

    return (
        <div className="row d-flex justify-content-center my-3">
            <div className="col-md-7 bg-info bg-opacity-10 rounded p-5">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{topic}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                        <p className="card-text">{content}</p>
                        <Link href={href} target="_blank" className="card-link">
                            View on Explorer
                        </Link>
                        {author && (
                            <h6 className="card-subtitle mb-2 text-muted mt-4">
                                <figure>
                                    <blockquote className="blockquote">
                                        <p className="small">Author: {author.toBase58()}</p>
                                    </blockquote>
                                    <figcaption className="blockquote-footer mt-1">
                                        <cite title="Source Title">
                                            {dayjs.unix(timestamp).format("DD-MMM-YYYY HH:MM:ss")}
                                        </cite>
                                    </figcaption>
                                </figure>
                            </h6>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;
