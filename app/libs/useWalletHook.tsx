// import { AnchorProvider, Program } from "@coral-xyz/anchor";
// import { AnchorWallet, useAnchorWallet, useConnection, useWallet, WalletContextState } from "@solana/wallet-adapter-react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import idl from "../../target/idl/sol_x.json";

// const programId = new PublicKey(idl.address);

// const useWalletHook = ():{
//     connection: Connection;
//     adapterWalletObj: WalletContextState;
//     anchorWalletObj: AnchorWallet | undefined;
//     provider: AnchorProvider;
//     program: Program;
// } => {
//     const { connection } = useConnection();
//     const adapterWalletObj = useWallet();
//     const anchorWalletObj = useAnchorWallet();

//     const provider = new AnchorProvider(connection, adapterWalletObj as any, {});
//     const program = new Program(idl as any, programId as any, provider as any);

//     console.log("Provider:", provider);
//     console.log("Program:", program);

//     return {
//         connection,
//         adapterWalletObj,
//         anchorWalletObj,
//         provider,
//         program
//     }
// };

// export default useWalletHook;



import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import idl from "../../target/idl/sol_x.json";

// Hardcoded program ID
// const programId = new PublicKey("Wg8YBGqpNcnv4NWNFh9cYvNiDFjZ8ZPHtXrazTbizg2");

const useWalletHook = () => {
    const { connection } = useConnection();
    const anchorWalletObj = useAnchorWallet();

    // Ensure provider is correctly initialized if wallet is available
    const provider = anchorWalletObj ? new AnchorProvider(connection, anchorWalletObj, AnchorProvider.defaultOptions()) : undefined;

    // Ensure the program is correctly initialized if provider is available
    const program = provider ? new Program(idl as any, provider) : undefined;

    return {
        connection,
        anchorWalletObj,
        provider,
        program
    };
};

export default useWalletHook;
