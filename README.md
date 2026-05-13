# ⚡ Solana Terminal

A sleek, minimal web app to interact with the Solana blockchain — connect your wallet, check your balance, send SOL, and monitor your recent on-chain activity in real time.

---

## 🖥️ Preview

> Connect your Phantom wallet on Devnet and get a live terminal-style dashboard for your Solana account.

---

## ✨ Features

- **Wallet Integration** — Connect any Solana wallet via `@solana/wallet-adapter` (Phantom, Backpack, etc.)
- **Live Balance** — Fetches and displays your current SOL balance on connect
- **Send SOL** — Transfer SOL to any address with a clean, minimal form
- **Recent Activity** — View your last 10 transactions with:
  - Truncated signature + one-click copy
  - Human-readable timestamps ("2 minutes ago")
  - Finalized / Pending confirmation status
- **Dark UI** — Terminal-inspired dark theme with emerald green accents

---

## 🛠️ Tech Stack

| Layer           | Technology               |
| --------------- | ------------------------ |
| Framework       | React + TypeScript       |
| Styling         | Tailwind CSS             |
| Blockchain      | Solana Web3.js           |
| Wallet          | `@solana/wallet-adapter` |
| RPC             | Helius (Devnet)          |
| Date formatting | `date-fns`               |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Solana wallet browser extension (e.g. [Phantom](https://phantom.app))

### Installation

```bash
git clone https://github.com/your-username/solana-terminal.git
cd solana-terminal
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and connect your wallet on **Devnet**.

---

## ⚙️ Configuration

The RPC endpoint is set in `App.tsx`. By default it uses a Helius Devnet endpoint. To use your own:

```tsx
const endpoint = useMemo(() => 'https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY', [network]);
```

To switch to **Mainnet**, change the network and endpoint:

```tsx
const network = WalletAdapterNetwork.Mainnet;
const endpoint = useMemo(() => 'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY', [network]);
```

> ⚠️ Make sure your wallet is set to the matching network in your browser extension.

---

## 📁 Project Structure

```
src/
├── index.css        # Global styles + Tailwind
└── App.tsx          # All components (Topbar, Balance, Transiction, Activity)
```

---

## 📦 Key Dependencies

```bash
npm install @solana/web3.js
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
npm install @solana/wallet-adapter-base @solana/wallet-adapter-wallets
npm install date-fns
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)
