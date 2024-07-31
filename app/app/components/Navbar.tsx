"use client";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <Link className="navbar-brand text-light" href="/">XonSOL</Link>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                className="nav-link active text-light"
                                aria-current="page"
                                href="/mytweets"
                            >
                                My Tweets
                            </Link>
                        </li>
                    </ul>
                </div>
                <WalletMultiButton />
            </div>
        </nav>
    )
}

export default Navbar;