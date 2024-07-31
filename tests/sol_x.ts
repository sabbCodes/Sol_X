import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolX } from "../target/types/sol_x";
import * as assert from "assert";

describe("sol_x", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolX as Program<SolX>;

  it("Can send a new tweet", async () => {
    const tweetKeyPair = anchor.web3.Keypair.generate();

    await program.methods.sendTweet("Sabb's first Tweet", "This is my tweet content. I'm excited!")
    .accounts({
      userTweet: tweetKeyPair.publicKey,
      tweetSender: program.provider.publicKey,
      // systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([tweetKeyPair])
    .rpc();

    const tweetAcct = await program.account.tweetsOnBlockchain.fetch(
      tweetKeyPair.publicKey
    );

    assert.equal(
      tweetAcct.author.toBase58(),
      program.provider.publicKey.toBase58()
    );
    assert.equal(tweetAcct.topic, "Sabb's first Tweet");
    assert.equal(tweetAcct.content, "This is my tweet content. I'm excited!");
    assert.ok(tweetAcct.timestamp);
  });

  it("Can send a tweet without a topic", async () => {
    const tweetKeyPair = anchor.web3.Keypair.generate();

    await program.methods.sendTweet("", "This tweet has no title. We want to allow people post withouth neccessarily adding a title.")
    .accounts({
      userTweet: tweetKeyPair.publicKey,
      tweetSender: program.provider.publicKey,
      // systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([tweetKeyPair])
    .rpc();

    const tweetAcct = await program.account.tweetsOnBlockchain.fetch(
      tweetKeyPair.publicKey
    );

    assert.equal(
      tweetAcct.author.toBase58(),
      program.provider.publicKey.toBase58()
    );
    assert.equal(tweetAcct.topic, "");
    assert.equal(tweetAcct.content, "This tweet has no title. We want to allow people post withouth neccessarily adding a title.");
    assert.ok(tweetAcct.timestamp);
  });

  // it("Can send a tweet from a new user", async () => {
  //   const newUser = anchor.web3.Keypair.generate();
  //   const tweetKeyPair = anchor.web3.Keypair.generate();

  //   const signature = await program.provider.connection.requestAirdrop(
  //     newUser.publicKey,
  //     1000000000
  //   );

  //     const latestBlockHash = await program.provider.connection.getLatestBlockhash();

  //   await program.provider.connection.confirmTransaction({
  //     blockhash: latestBlockHash,
  //     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //     signature: signature,
  //   });

  //   await program.methods.sendTweet("Other user's Tweet", "Hey everyone, trust you're doing well. Okay, bye!")
  //   .accounts({
  //     userTweet: tweetKeyPair.publicKey,
  //     tweetSender: newUser.publicKey,
  //     // systemProgram: anchor.web3.SystemProgram.programId,
  //   })
  //   .signers([newUser, tweetKeyPair])
  //   .rpc();

  //   const tweetAcct = await program.account.tweetsOnBlockchain.fetch(
  //     tweetKeyPair.publicKey
  //   );

  //   assert.equal(
  //     tweetAcct.author.toBase58(),
  //     newUser.publicKey.toBase58()
  //   );
  //   assert.equal(tweetAcct.topic, "Other user's Tweet");
  //   assert.equal(tweetAcct.content, "Hey everyone, trust you're doing well. Okay, bye!");
  //   assert.ok(tweetAcct.timestamp);
  // });

  it("Can't send a tweet with a topic more than 50 chars", async () => {
    const tooLongTopic = "tooLongTopic".repeat(62);

    try {
      const tweetKeyPair = anchor.web3.Keypair.generate();
      await program.methods.sendTweet(tooLongTopic, "This tweet has no title. We want to allow people post withouth neccessarily adding a title.")
      .accounts({
        userTweet: tweetKeyPair.publicKey,
        tweetSender: program.provider.publicKey,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tweetKeyPair])
      .rpc();

      const tweetAcct = await program.account.tweetsOnBlockchain.fetch(
        tweetKeyPair.publicKey
      );
    } catch(err) {
      assert.ok("It can't send tweet with too long topic");
      return;
    }

    assert.fail("Test failed cause topic was too long!")
  });

  it("Can fetch all tweets from the blockchain", async () => {
    const tweetsAccouts = await program.account.tweetsOnBlockchain.all();

    console.log(tweetsAccouts);
  });

  it("Can filter tweets by a user", async () => {
    const userPubKey = program.provider.publicKey;
    const tweetsAccouts = await program.account.tweetsOnBlockchain.all([
      {
        memcmp: {
          offset: 8, //DISCRIMINATOR
          bytes: userPubKey.toBase58(),
        },
      },
    ]);

    assert.equal(tweetsAccouts.length, 2);
  });
});
