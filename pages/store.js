import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGame } from '../context/GameContext';

const ITEMS = [
  { key: 'pokeballs', name: 'Small Net', emoji: '🕸️', price: 25, type: 'ball' },
  { key: 'greatballs', name: 'Medium Net', emoji: '🦑', price: 50, type: 'ball' },
  { key: 'ultraballs', name: 'Large Net', emoji: '🦈', price: 75, type: 'ball' },
  { key: 'masterballs', name: 'Large Chains', emoji: '⚓️', price: 500, type: 'ball' },
  { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', price: 30, type: 'heal' },
  { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🥤', price: 60, type: 'heal' },
  { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', price: 100, type: 'heal' },
  { key: 'fwrod', name: 'Freshwater Rod', emoji: '🎣', price: 100, oneTime: true, type: 'rod' },
  { key: 'swrod', name: 'Saltwater Rod', emoji: '🪝', price: 150, oneTime: true, type: 'rod' },
  { key: 'maggots', name: 'Maggots (Bait)', emoji: '🪱', price: 5, type: 'bait' },
  { key: 'lugworm', name: 'Lug-worm (Bait)', emoji: '🪱', price: 7, type: 'bait' },
  { key: 'boot', name: 'Old Boot', emoji: '🥾', price: 8, sellOnly: true, type: 'junk' },
  { key: 'lure', name: 'Lost Lure', emoji: '🪝', price: 12, sellOnly: true, type: 'junk' }
];

export default function Store() {
  const { game, setGame } = useGame();
  const [tab, setTab] = useState('buy');
  const [message, setMessage] = useState('');
  const [buyQuantities, setBuyQuantities] = useState({});
  const [sellQuantities, setSellQuantities] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (game) {
      const newBuy = {};
      const newSell = {};
      ITEMS.forEach(item => {
        // Ensure undefined values are treated as 0
        const owned = game[item.key] || 0;
        const maxBuy = Math.floor((game.coins || 0) / item.price);
        newBuy[item.key] = maxBuy >= 1 ? 1 : 0;
        newSell[item.key] = owned > 0 ? 1 : 0;
      });
      setBuyQuantities(newBuy);
      setSellQuantities(newSell);
    }
  }, [game, tab]);

  if (!game) return <p>Loading store...</p>;

  function handleBuy(item) {
    if (item.oneTime && (game[item.key] || 0) > 0) {
      setMessage(`You already own ${item.name}!`);
      return;
    }
    const quantity = buyQuantities[item.key] || 1;
    const maxBuy = Math.floor((game.coins || 0) / item.price);
    if (maxBuy < 1) {
      setMessage(`Not enough coins for ${item.name}!`);
      return;
    }
    const qty = Math.min(quantity, maxBuy);
    const totalCost = qty * item.price;
    const updated = { ...game, coins: (game.coins || 0) - totalCost };
    updated[item.key] = (updated[item.key] || 0) + qty;
    setGame(updated);
    setMessage(`Bought ${qty} ${item.name}${qty > 1 ? 's' : ''} for ${totalCost} coins!`);
    const newMax = Math.floor(updated.coins / item.price);
    setBuyQuantities(q => ({ ...q, [item.key]: newMax >= 1 ? 1 : 0 }));
    setSellQuantities(q => ({ ...q, [item.key]: updated[item.key] }));
  }

  function handleSell(item) {
    const owned = game[item.key] || 0;
    const quantity = sellQuantities[item.key] || 1;
    if (owned < 1) {
      setMessage(`You don't have any ${item.name} to sell!`);
      return;
    }
    const qty = Math.min(quantity, owned);
    const sellPrice = Math.floor(item.price / 2);
    const totalGain = qty * sellPrice;
    const updated = { ...game, coins: (game.coins || 0) + totalGain };
    updated[item.key] = owned - qty;
    setGame(updated);
    setMessage(`Sold ${qty} ${item.name}${qty > 1 ? 's' : ''} for ${totalGain} coins!`);
    setSellQuantities(q => ({ ...q, [item.key]: updated[item.key] > 0 ? 1 : 0 }));
  }

  function renderQuantityDropdown(type, item, max) {
    const quantities = Array.from({ length: max }, (_, i) => i + 1);
    if (max < 1) return <span style={{ color: '#aaa', fontSize: 13 }}>—</span>;
    return (
      <select
        value={type === "buy" ? (buyQuantities[item.key] || 1) : (sellQuantities[item.key] || 1)}
        style={{ fontSize: 15, padding: '1px 5px', borderRadius: 5, marginRight: 7 }}
        onChange={e => {
          const val = parseInt(e.target.value, 10);
          if (type === "buy") set
