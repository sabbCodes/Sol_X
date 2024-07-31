"use client";

import useWalletHook from "@/libs/useWalletHook";
import { useEffect, useRef, useState } from "react";
import TweetCard from "./components/TweetCard";
import { authorFilter, fetchTweets } from "@/libs/fetchTweets";
import CreateNewTweet from "./components/CreateNewTweet";

export default function Home() {
    const { program } = useWalletHook();
    const [allTweets, setAllTweets] = useState([]);
    const [author, setAuthor] = useState("");
    const autherRef = useRef();

    useEffect(() => {
      fetchTweets(program).then((tweets) => {
          setAllTweets(tweets);
      })
      .catch((error) => {
          console.error("Error fetching tweets:", error);
      });
    }, [program]);

    useEffect(() => {
      if (author !== "") {
        console.log("was in here", author);
        fetchTweets(program, [authorFilter(author)])
          .then((tweets: any) => {
            setAllTweets(tweets);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, [author]);

    const handleAuthorFilter = () => {
      const af = autherRef.current.value;
      setAuthor(af);
    };

    if (!allTweets.length){
      return (
        <div className="container p-5 m-5 bg-warning bg-opacity-10">
          <h3>Loading, please wait...</h3>
        </div>
      )
    }

    return (
      <div>
        <CreateNewTweet />
        <div className="row d-flex justify-content-center ">
          <div className="col-md-7 bg-warning  bg-opacity-10 p-3">
            <input
              type="text"
              className="form-control"
              placeholder="259wikzVEWyMeV1TyockW9SE7BbZSqunjaQs8Gwv9KA6"
              ref={autherRef}
            />
            <button className="btn btn-primary mt-3" onClick={handleAuthorFilter}>
              <i className="bi bi-funnel"> Filter</i>
            </button>
          </div>
        </div>
        {allTweets.map((tweet, index) => {
          return <TweetCard tweet={tweet} key={`tweet_${index}`} />
        })}
      </div>
    );
}
