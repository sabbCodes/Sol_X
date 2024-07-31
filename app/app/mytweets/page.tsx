"use client"

import { useEffect, useRef, useState } from "react";
import { authorFilter, fetchTweets } from "../../libs/fetchTweets";
import useWalletHook from "../../libs/useWalletHook";
import TweetCard from "../components/TweetCard";

const MyTweets = () => {
  const { program, connection, adapterWalletObj } = useWalletHook();
  const myPbKey = adapterWalletObj?.publicKey?.toBase58();
  console.log(myPbKey)

  const [allTweets, setAllTweets] = useState([]);

  useEffect(() => {
    fetchTweets(program, [authorFilter(myPbKey)])
      .then((tweets: any) => {
        setAllTweets(tweets);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!allTweets.length) {
    return (
      <div className="container p-5 m-5 bg-warning bg-opacity-10">
        <h3>
          you haven't tweets yet or unable to find tweets from author '{myPbKey}
          '
        </h3>
      </div>
    );
  }

  return (
    <>
      {allTweets.map((tweet, idx) => {
        return <TweetCard tweet={tweet} key={`tweet_${idx}`} />;
      })}
    </>
  );
};

export default MyTweets;