// List of cryptocurrencies and their metadata

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  description?: string;
  website?: string;
  twitter?: string;
  reddit?: string;
  github?: string;
  category?: string;
  tags?: string[];
}

const coinList: Coin[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '/icons/btc.svg',
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.',
    website: 'https://bitcoin.org/',
    twitter: 'https://twitter.com/bitcoin',
    reddit: 'https://reddit.com/r/bitcoin',
    github: 'https://github.com/bitcoin',
    category: 'Currency',
    tags: ['Proof of Work', 'Store of Value', 'Layer 1']
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/icons/eth.svg',
    description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.',
    website: 'https://ethereum.org/',
    twitter: 'https://twitter.com/ethereum',
    reddit: 'https://reddit.com/r/ethereum',
    github: 'https://github.com/ethereum',
    category: 'Smart Contract Platform',
    tags: ['Smart Contracts', 'DeFi', 'NFTs', 'Layer 1']
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '/icons/sol.svg',
    description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.',
    website: 'https://solana.com/',
    twitter: 'https://twitter.com/solana',
    reddit: 'https://reddit.com/r/solana',
    github: 'https://github.com/solana-labs',
    category: 'Smart Contract Platform',
    tags: ['High Performance', 'DeFi', 'NFTs', 'Layer 1']
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    icon: '/icons/ada.svg',
    description: 'Cardano is a proof-of-stake blockchain platform: the first to be founded on peer-reviewed research and developed through evidence-based methods.',
    website: 'https://cardano.org/',
    twitter: 'https://twitter.com/cardano',
    reddit: 'https://reddit.com/r/cardano',
    github: 'https://github.com/input-output-hk',
    category: 'Smart Contract Platform',
    tags: ['Proof of Stake', 'Research', 'Layer 1']
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    icon: '/icons/xrp.svg',
    description: 'XRP is the native cryptocurrency of the XRP Ledger, which facilitates fast, energy-efficient transactions, especially for cross-border payments.',
    website: 'https://ripple.com/xrp/',
    twitter: 'https://twitter.com/Ripple',
    reddit: 'https://reddit.com/r/ripple',
    github: 'https://github.com/ripple',
    category: 'Payment',
    tags: ['Cross-Border', 'Enterprise', 'Banking']
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    icon: '/icons/doge.svg',
    description: 'Dogecoin is a cryptocurrency created by software engineers Billy Markus and Jackson Palmer, who decided to create a payment system as a joke.',
    website: 'https://dogecoin.com/',
    twitter: 'https://twitter.com/dogecoin',
    reddit: 'https://reddit.com/r/dogecoin',
    github: 'https://github.com/dogecoin',
    category: 'Currency',
    tags: ['Meme', 'Payment', 'Layer 1']
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    icon: '/icons/dot.svg',
    description: 'Polkadot is a network protocol that allows arbitrary data—not just tokens—to be transferred across blockchains.',
    website: 'https://polkadot.network/',
    twitter: 'https://twitter.com/Polkadot',
    reddit: 'https://reddit.com/r/dot',
    github: 'https://github.com/paritytech',
    category: 'Interoperability',
    tags: ['Interoperability', 'Parachains', 'Layer 0']
  },
  {
    id: 'usd-coin',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '/icons/usdc.svg',
    description: 'USD Coin (USDC) is a stablecoin pegged to the U.S. dollar on a 1:1 basis.',
    website: 'https://www.circle.com/en/usdc',
    twitter: 'https://twitter.com/circle',
    reddit: 'https://reddit.com/r/USDC',
    github: 'https://github.com/centrehq',
    category: 'Stablecoin',
    tags: ['Stablecoin', 'USD-Pegged', 'Centralized']
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    icon: '/icons/bnb.svg',
    description: 'BNB is the cryptocurrency issued by the Binance exchange and trades with the BNB symbol.',
    website: 'https://www.binance.com/en/bnb',
    twitter: 'https://twitter.com/binance',
    reddit: 'https://reddit.com/r/binance',
    github: 'https://github.com/binance-chain',
    category: 'Exchange',
    tags: ['Exchange', 'Layer 1', 'Smart Contracts']
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: '/icons/avax.svg',
    description: 'Avalanche is a layer one blockchain that functions as a platform for decentralized applications and custom blockchain networks.',
    website: 'https://www.avax.network/',
    twitter: 'https://twitter.com/avalancheavax',
    reddit: 'https://reddit.com/r/Avax',
    github: 'https://github.com/ava-labs',
    category: 'Smart Contract Platform',
    tags: ['Smart Contracts', 'DeFi', 'Layer 1']
  }
];

export default coinList;

// Helper function to find a coin by ID
export function getCoinById(id: string): Coin | undefined {
  return coinList.find(coin => coin.id === id);
}

// Helper function to find a coin by symbol
export function getCoinBySymbol(symbol: string): Coin | undefined {
  return coinList.find(coin => coin.symbol.toLowerCase() === symbol.toLowerCase());
}

// Get popular categories
export function getCategories(): string[] {
  const categories = [...new Set(coinList.map(coin => coin.category || ''))];
  return categories.filter(Boolean);
}

// Get all tags
export function getAllTags(): string[] {
  const allTags = coinList.flatMap(coin => coin.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}

// Get coins by category
export function getCoinsByCategory(category: string): Coin[] {
  return coinList.filter(coin => coin.category === category);
}

// Get coins by tag
export function getCoinsByTag(tag: string): Coin[] {
  return coinList.filter(coin => coin.tags?.includes(tag));
}
