import React from 'react';
import { 
  Crosshair, 
  Target, 
  Zap, 
  Layers, 
  Disc, 
  Radio, 
  Sparkles, 
  UserCheck, 
  Shield,
  Flame,
  Scissors
} from 'lucide-react';

const ICONS_MAP = {
  rifles: Flame,
  sniper_rifles: Target,
  pistols: Zap,
  smg: Radio,
  shotguns: Shield,
  machine_guns: Layers,
  knives: Scissors,
  gloves: Sparkles,
  agents: UserCheck,
  music: Disc
};

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const IconComponent = ICONS_MAP[cat.id] || Crosshair;
        const isSpecial = cat.id === 'knives' || cat.id === 'gloves';

        return (
          <button
            key={cat.id}
            id={`tab-category-${cat.id}`}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isSelected
                ? isSpecial
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-cs-gold border border-cs-gold shadow-gold font-bold scale-[1.02]'
                  : 'bg-white/15 text-white border border-white/30 font-bold scale-[1.02]'
                : 'bg-cs-card/80 text-gray-400 border border-white/10 hover:bg-cs-card hover:text-gray-200 hover:border-white/20'
            }`}
          >
            <IconComponent 
              size={17} 
              className={isSelected ? (isSpecial ? 'text-cs-gold animate-pulse' : 'text-white') : 'text-gray-400'} 
            />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
