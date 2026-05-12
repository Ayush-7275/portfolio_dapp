import { APITester } from './APITester';
import './index.css';

import React, { useMemo, useState } from 'react';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

type Transaction = {
  id: string;
  type: string;
  icon: string; // e.g., 'call_made', 'call_received'
  address: string;
  amount: string;
  status: string;
  statusIcon: string; // e.g., 'check_circle', 'pending'
  isPositive: boolean; // to determine if amount is green or default white
};

export const App = () => {
  const network = WalletAdapterNetwork.Devnet; //this is what phantom will use devnet,mainnet

  const endpoint = useMemo(
    () => 'https://devnet.helius-rpc.com/?api-key=2a9467ac-f1dc-4a3d-81b8-7954ad4e75a9',
    [network]
  ); //this is what we will use devnet,mainnet

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            {/* code goes here */}
            <Topbar></Topbar>
            <Balance></Balance>
            <div>
              <Transiction></Transiction>
              <Activity></Activity>
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
    <header className='sticky top-0 z-50 w-full border-b border-white/10 bg-surface-dark/80 backdrop-blur-md'>
      <div className='mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-8'>
        {/* Left Side: Logo and Navigation */}
        <div className='flex items-center gap-8'>
          <span className='text-2xl font-bold tracking-tighter text-white'>SOLANA_DEV_STATION</span>
        </div>

        {/* Right Side: Wallet Button */}
        <WalletMultiButton ></WalletMultiButton>
      </div>
    </header>
  );
};
const Balance = () => {
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
          <h1 className='mb-2 text-5xl font-bold tracking-tight text-white md:text-7xl'>24,591.08 SOL.</h1>
          <p className='text-lg text-gray-400'>Available Balance</p>
        </div>
      </section>
    </main>
  );
};
const Transiction = () => {
  return (
    <div className='col-span-1 md:col-span-5'>
      {/* Card Container */}
      <div className='rounded-2xl border border-white/10 bg-surface-dark p-8 shadow-2xl shadow-black/40'>
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
                placeholder='0.00'
                className='w-full rounded-lg border border-white/10 bg-base-bg py-3 pl-4 pr-16 font-mono text-sm text-white transition-all placeholder:text-gray-600 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald'
              />
              <span className='absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm text-gray-500'>SOL</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='button'
            className='mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald font-medium text-white transition-all hover:bg-emerald-600 active:scale-95'
          >
            Send Transaction
            <span className='material-symbols-outlined text-[18px]'>arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
};
const Activity = () => {
  const transactions: Transaction[] = [];

  return (
    <div className='col-span-1 md:col-span-7'>
      {/* Card Container */}
      <div className='flex h-full flex-col rounded-2xl border border-white/10 bg-surface-dark p-8 shadow-2xl shadow-black/40'>
        <h2 className='mb-6 text-2xl font-semibold text-white'>Recent Activity</h2>

        <div className='flex-grow overflow-x-auto'>
          <table className='w-full border-collapse text-left'>
            {/* Table Header */}
            <thead>
              <tr className='border-b border-white/10 font-mono text-xs uppercase tracking-wider text-gray-500'>
                <th className='pb-4 font-medium'>Type</th>
                <th className='pb-4 font-medium'>Address</th>
                <th className='pb-4 text-right font-medium'>Amount</th>
                <th className='pb-4 text-right font-medium'>Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className='font-mono text-sm text-white'>
              {transactions.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={4} className='py-12 text-center text-gray-500'>
                    No recent activity found.
                  </td>
                </tr>
              ) : (
                // Dynamic Rows
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className='group border-b border-white/10 transition-colors last:border-0 hover:bg-white/5'
                  >
                    {/* Type Column */}
                    <td className='flex items-center gap-2 py-4 text-gray-400 transition-colors group-hover:text-white'>
                      <span className='material-symbols-outlined text-[16px]'>{tx.icon}</span>
                      {tx.type}
                    </td>

                    {/* Address Column */}
                    <td className='max-w-[120px] truncate py-4 text-gray-400 transition-colors group-hover:text-white'>
                      {tx.address}
                    </td>

                    {/* Amount Column */}
                    <td className={`py-4 text-right ${tx.isPositive ? 'text-emerald' : 'text-white'}`}>{tx.amount}</td>

                    {/* Status Column */}
                    <td className='flex items-center justify-end gap-2 py-4 text-right text-emerald'>
                      <span className='material-symbols-outlined text-[14px]'>{tx.statusIcon}</span>
                      {tx.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
