import './index.css';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { formatDistanceToNow } from 'date-fns';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

type TransactionUI = {
  id: string;
  signature: string;
  isFinalized: boolean;
  time: string;
};

export const App = () => {
  const network = WalletAdapterNetwork.Devnet; //this is what phantom will use devnet,mainnet

  const endpoint = useMemo(() => process.env.HELIUS_RPC_URL!, [network]); //this is what we will use devnet,mainnet
  if (!endpoint) return ;
  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            {/* code goes here */}
            <Topbar></Topbar>
            <Balance></Balance>
            <div className='flex items-stretch bg-[#0A1411]'>
              <div className='flex-1'>
                <Transiction />
              </div>
              <div className='flex-1'>
                <Activity />
              </div>
            </div>
            {/* code goes here */}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

const Topbar = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-white/10 bg-surface-dark backdrop-blur-lg'>
      <div className='mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-8'>
        {/* Left Side: Logo and Navigation */}
        <div className='flex items-center gap-8'>
          <span className='text-2xl font-bold tracking-tighter text-white'>SOLANA TERMINAL</span>
        </div>

        {/* Right Side: Wallet Button */}
        <WalletMultiButton></WalletMultiButton>
      </div>
    </header>
  );
};
const Balance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!publicKey) return;

    connection.getBalance(publicKey).then((lamports) => {
      setBalance(lamports / LAMPORTS_PER_SOL);
    });
  }, [publicKey, connection]);

  return (
    <main className='flex grow flex-col items-center'>
      {/* Hero Section*/}
      <section className='relative w-full overflow-hidden bg-base-bg py-32'>
        {/* Subtle background glow effect*/}
        <div
          className='pointer-events-none absolute inset-0 opacity-10'
          style={{
            background: `
              radial-gradient(circle at 20% 30%, #10b981 0%, transparent 40%), 
              radial-gradient(circle at 80% 70%, #059669 0%, transparent 40%)
            `,
            filter: 'blur(80px)'
          }}
        />

        <div className='relative z-10 mx-auto max-w-[1400px] px-8 text-center'>
          {publicKey ? (
            <h1 className='mb-2 text-5xl font-bold tracking-tight text-white md:text-7xl'>{balance} SOL.</h1>
          ) : (
            <h1 className='mb-2 text-5xl font-bold tracking-tight text-white md:text-7xl'>Wallet not Connected</h1>
          )}
          {publicKey ? <p className='text-lg text-gray-400'>Available Balance</p> : <p></p>}
        </div>
      </section>
    </main>
  );
};
const Transiction = () => {
  const recipientAdressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendSol = async () => {
    if (!publicKey) return;

    const recipient = recipientAdressRef.current?.value;
    if (!recipient) return console.error('Recipient address is required');

    const amount = Number(amountRef.current?.value);
    if (!amount) return console.error('Amount is required');

    const transiction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipient),
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    await sendTransaction(transiction, connection);
    alert(`Sent ${amount} to ${recipient}`);
  };

  return (
    <div className='col-span-1 md:col-span-5 h-full'>
      <div className='h-full rounded-2xl border border-white/10 bg-surface-dark p-8 shadow-2xl shadow-black/40'>
        <h2 className='mb-6 text-2xl font-semibold text-white'>Send SOL</h2>

        <form className='flex flex-col gap-5'>
          {/* Recipient Address Field */}
          <div>
            <label htmlFor='recipient' className='mb-2 block text-sm font-medium text-gray-300'>
              Recipient Address
            </label>
            <input
              id='recipient'
              type='text'
              placeholder='Enter Solana address'
              ref={recipientAdressRef}
              className='w-full rounded-lg border border-white/10 bg-base-bg px-4 py-3 font-mono text-sm text-white transition-all placeholder:text-gray-600 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald'
            />
          </div>

          {/* Amount Field */}
          <div>
            <label htmlFor='amount' className='mb-2 block text-sm font-medium text-gray-300'>
              Amount
            </label>
            <div className='relative'>
              <input
                id='amount'
                type='number'
                step='any'
                ref={amountRef}
                placeholder='0.00'
                className='w-full rounded-lg border border-white/10 bg-base-bg py-3 pl-4 pr-16 font-mono text-sm text-white transition-all placeholder:text-gray-600 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald'
              />
              <span className='absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm text-gray-500'>SOL</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={sendSol}
            type='button'
            className='mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald font-medium text-white transition-all hover:bg-emerald-600 active:scale-95'
          >
            Send Transaction
          </button>
        </form>
      </div>
    </div>
  );
};
const Activity = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<TransactionUI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    const fetchRecentActivity = async () => {
      setIsLoading(true);
      try {
        const signatureInfos = await connection.getSignaturesForAddress(publicKey, { limit: 10 });

        const formatted: TransactionUI[] = signatureInfos.map((info) => ({
          id: info.signature,
          signature: info.signature,
          isFinalized: info.confirmationStatus === 'finalized',
          time: info.blockTime ? formatDistanceToNow(new Date(info.blockTime * 1000), { addSuffix: true }) : 'Unknown'
        }));

        setTransactions(formatted);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivity();
  }, [publicKey, connection]);

  const copyToClipboard = (sig: string) => {
    navigator.clipboard.writeText(sig);
    setCopiedId(sig);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className='col-span-1 md:col-span-7 h-full'>
      <div className='flex h-full flex-col rounded-2xl border border-white/10 bg-surface-dark p-8 shadow-2xl shadow-black/40'>
        <h2 className='mb-6 text-2xl font-semibold text-white'>Recent Activity</h2>

        <div className='grow overflow-x-auto'>
          <table className='w-full border-collapse text-left'>
            <thead>
              <tr className='border-b border-white/10 font-mono text-xs uppercase tracking-wider text-gray-500'>
                <th className='pb-4 font-medium'>Signature</th>
                <th className='pb-4 font-medium'>Time</th>
                <th className='pb-4 text-right font-medium'>Status</th>
              </tr>
            </thead>
            <tbody className='font-mono text-sm text-white'>
              {isLoading && (
                <tr>
                  <td colSpan={2} className='py-12 text-center text-gray-500 animate-pulse'>
                    Loading blockchain data...
                  </td>
                </tr>
              )}

              {!isLoading &&
                transactions.map((tx) => (
                  <tr key={tx.id} className='border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors'>
                    <td className='py-4'>
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-400 font-mono'>
                          {`${tx.signature.slice(0, 4)}...${tx.signature.slice(-4)}`}
                        </span>
                        <button
                          onClick={() => copyToClipboard(tx.signature)}
                          className='shrink-0 text-gray-500 hover:text-white transition-colors'
                          title='Copy signature'
                        >
                          {copiedId === tx.signature ? (
                            // Checkmark SVG
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='14'
                              height='14'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <polyline points='20 6 9 17 4 12' />
                            </svg>
                          ) : (
                            // Copy SVG
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='14'
                              height='14'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
                              <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className='py-4 text-gray-400'>{tx.time}</td>
                    <td className={`py-4 text-right ${tx.isFinalized ? 'text-emerald' : 'text-yellow-400'}`}>
                      {tx.isFinalized ? 'Finalized' : 'Pending'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
