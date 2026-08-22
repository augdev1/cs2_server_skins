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
  Music,
  Scissors
} from 'lucide-react';

const ICONS_MAP = {
  rifles: Crosshair,
  sniper_rifles: Target,
  pistols: Zap,
  smg: Layers,
  shotguns: Crosshair,
  machine_guns: Layers,
  knives: Scissors,
  gloves: Sparkles,
  agents: UserCheck,
  music: Music
};

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      scrollbarWidth: 'none'
    }}>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const IconComponent = ICONS_MAP[cat.id] || Crosshair;
        const isSpecial = cat.id === 'knives' || cat.id === 'gloves';

        return (
          <button
            key={cat.id}
            id={`tab-category-${cat.id}`}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '10px',
              border: isSelected 
                ? (isSpecial ? '1px solid var(--cs-gold)' : '1px solid rgba(255, 255, 255, 0.3)')
                : '1px solid var(--border-color)',
              background: isSelected
                ? (isSpecial 
                    ? 'linear-gradient(135deg, rgba(240, 178, 50, 0.25), rgba(240, 178, 50, 0.08))' 
                    : 'rgba(255, 255, 255, 0.12)')
                : 'var(--bg-card)',
              color: isSelected 
                ? (isSpecial ? 'var(--cs-gold)' : '#fff')
                : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: isSelected ? 700 : 500,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: isSelected && isSpecial ? '0 0 15px rgba(240, 178, 50, 0.2)' : 'none'
            }}
          >
            <IconComponent size={16} color={isSelected ? (isSpecial ? 'var(--cs-gold)' : '#fff') : 'currentColor'} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
