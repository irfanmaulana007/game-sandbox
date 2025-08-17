import React, { useState } from 'react';
import {
  EQUIPMENT_DATA,
  WEAPONS,
  ARMOR,
  ACCESSORIES,
  getEquipmentByLevel,
  getEquipmentByLevelAndRarity,
} from '../../constants/equipment';

// Example React component using generated equipment data
export const EquipmentShop: React.FC = () => {
  const [selectedType, setSelectedType] = useState<
    'weapon' | 'armor' | 'accessory'
  >('weapon');
  const [selectedRarity, setSelectedRarity] = useState<
    'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  >('common');
  const [playerLevel, setPlayerLevel] = useState(15);

  // Get available equipment based on player level
  const availableEquipment = getEquipmentByLevel(playerLevel);

  // Get equipment by type and rarity
  const filteredEquipment = availableEquipment.filter(
    (eq) => eq.type === selectedType && eq.rarity === selectedRarity
  );

  // Get best equipment for each rarity at current level
  const bestEquipment = {
    common: getEquipmentByLevelAndRarity(playerLevel, 'common')
      .filter((eq) => eq.type === selectedType)
      .sort(
        (a, b) =>
          b.status.attack +
          b.status.defense +
          b.status.speed +
          b.status.critical -
          (a.status.attack +
            a.status.defense +
            a.status.speed +
            a.status.critical)
      )[0],
    uncommon: getEquipmentByLevelAndRarity(playerLevel, 'uncommon')
      .filter((eq) => eq.type === selectedType)
      .sort(
        (a, b) =>
          b.status.attack +
          b.status.defense +
          b.status.speed +
          b.status.critical -
          (a.status.attack +
            a.status.defense +
            a.status.speed +
            a.status.critical)
      )[0],
    rare: getEquipmentByLevelAndRarity(playerLevel, 'rare')
      .filter((eq) => eq.type === selectedType)
      .sort(
        (a, b) =>
          b.status.attack +
          b.status.defense +
          b.status.speed +
          b.status.critical -
          (a.status.attack +
            a.status.defense +
            a.status.speed +
            a.status.critical)
      )[0],
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Equipment Shop</h1>

      {/* Player Level Selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">
          Player Level: {playerLevel}
        </label>
        <input
          type="range"
          min="1"
          max="40"
          value={playerLevel}
          onChange={(e) => setPlayerLevel(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Equipment Type Selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Equipment Type</label>
        <div className="flex gap-2">
          {(['weapon', 'armor', 'accessory'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded px-4 py-2 ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity Selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Rarity</label>
        <div className="flex gap-2">
          {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map(
            (rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`rounded px-4 py-2 ${
                  selectedRarity === rarity
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Best Equipment Comparison */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          Best {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} at
          Level {playerLevel}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(bestEquipment).map(([rarity, equipment]) => {
            if (!equipment) return null;
            const totalStats =
              equipment.status.attack +
              equipment.status.defense +
              equipment.status.speed +
              equipment.status.critical;

            return (
              <div key={rarity} className="rounded-lg border bg-gray-50 p-4">
                <h3 className="text-lg font-semibold capitalize">{rarity}</h3>
                <p className="mb-2 text-sm text-gray-600">{equipment.name}</p>
                <div className="text-sm">
                  <p>Attack: {equipment.status.attack}</p>
                  <p>Defense: {equipment.status.defense}</p>
                  <p>Speed: {equipment.status.speed}</p>
                  <p>Critical: {equipment.status.critical}</p>
                  <p className="mt-2 font-semibold">
                    Total Stats: {totalStats}
                  </p>
                  <p className="mt-2 text-blue-600">
                    Price: {equipment.price.buy} gold
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Equipment List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Available{' '}
          {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} (
          {filteredEquipment.length} items)
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.slice(0, 12).map((equipment) => (
            <div
              key={equipment.id}
              className="rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold">{equipment.name}</h3>
              <p className="mb-2 text-sm text-gray-600">
                {equipment.description}
              </p>
              <div className="space-y-1 text-sm">
                <p>Level: {equipment.minLevel}</p>
                <p>Attack: {equipment.status.attack}</p>
                <p>Defense: {equipment.status.defense}</p>
                <p>Speed: {equipment.status.speed}</p>
                <p>Critical: {equipment.status.critical}</p>
                <p className="font-semibold text-blue-600">
                  Buy: {equipment.price.buy} gold
                </p>
                <p className="text-green-600">
                  Sell: {equipment.price.sell} gold
                </p>
              </div>
            </div>
          ))}
        </div>
        {filteredEquipment.length > 12 && (
          <p className="mt-4 text-center text-gray-500">
            Showing 12 of {filteredEquipment.length} items...
          </p>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-8 rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 font-semibold">Shop Statistics</h3>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <p className="font-medium">Total Equipment:</p>
            <p>{EQUIPMENT_DATA.length}</p>
          </div>
          <div>
            <p className="font-medium">Weapons:</p>
            <p>{WEAPONS.length}</p>
          </div>
          <div>
            <p className="font-medium">Armor:</p>
            <p>{ARMOR.length}</p>
          </div>
          <div>
            <p className="font-medium">Accessories:</p>
            <p>{ACCESSORIES.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentShop;
