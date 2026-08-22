import React from 'react';
import { Sparkles, Edit3, ShieldAlert } from 'lucide-react';

export default function WeaponCard({ weapon, equippedSkin, equippedSkinInfo, onCustomize }) {
  const hasCustomSkin = !!equippedSkin && Number(equippedSkin.weapon_paint_id) > 0;
  
  // Imagem e Nome dinâmicos: Se tiver skin equipada, mostra a imagem da skin, senão a da arma padrão
  const displayedImage = (hasCustomSkin && equippedSkinInfo?.image) 
    ? equippedSkinInfo.image 
    : weapon.image;
    
  const displayedName = (hasCustomSkin && equippedSkinInfo?.paint_name) 
    ? equippedSkinInfo.paint_name 
    : weapon.name;

  const rarityColor = equippedSkinInfo?.rarity_color || (hasCustomSkin ? '#f0b232' : 'transparent');
  const rarityName = equippedSkinInfo?.rarity_name || '';

  // Formata o desgaste (Wear / Float)
  const getWearCondition = (wear) => {
    const val = Number(wear);
    if (val < 0.07) return 'FN';
    if (val < 0.15) return 'MW';
    if (val < 0.38) return 'FT';
    if (val < 0.45) return 'WW';
    return 'BS';
  };

  const isStatTrak = Number(equippedSkin?.weapon_stattrak) === 1;

  return (
    <div
      onClick={onCustomize}
      className={`group relative flex flex-col justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-md ${
        hasCustomSkin
          ? 'bg-gradient-to-b from-amber-500/10 via-cs-card to-cs-surface border-2 border-cs-gold/50 shadow-gold hover:border-cs-gold hover:scale-[1.03]'
          : 'bg-cs-card/70 border border-white/10 hover:bg-cs-card hover:border-white/20 hover:scale-[1.02]'
      }`}
      style={{
        borderBottomColor: hasCustomSkin && rarityColor !== 'transparent' ? rarityColor : undefined,
        borderBottomWidth: hasCustomSkin ? '3px' : '1px'
      }}
    >
      {/* Top badges */}
      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {weapon.category}
        </span>

        <div className="flex items-center gap-1.5">
          {isStatTrak && (
            <span className="text-[10px] font-extrabold bg-orange-600/30 text-orange-400 border border-orange-500/40 px-1.5 py-0.5 rounded">
              ST™
            </span>
          )}

          {hasCustomSkin ? (
            <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 text-cs-gold border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
              <Sparkles size={11} /> Equipado
            </span>
          ) : (
            <span className="text-[10px] text-gray-500 font-medium">
              Padrão
            </span>
          )}
        </div>
      </div>

      {/* Weapon / Skin Image Container */}
      <div className="w-full h-28 flex items-center justify-center my-2 relative overflow-hidden">
        <img
          src={displayedImage}
          alt={displayedName}
          className="max-w-[190px] max-h-[95px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ak47.png';
          }}
        />
      </div>

      {/* Weapon & Skin Title */}
      <div className="w-full text-center mt-2">
        <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-1 group-hover:text-cs-gold transition-colors">
          {displayedName}
        </h4>
        
        <div className="flex items-center justify-center gap-2 mt-1">
          {hasCustomSkin ? (
            <>
              {rarityName && (
                <span 
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40"
                  style={{ color: rarityColor }}
                >
                  {rarityName.replace('★ ', '')}
                </span>
              )}
              <span className="text-[11px] font-semibold text-cs-gold">
                Paint #{equippedSkin.weapon_paint_id}
              </span>
              {equippedSkin.weapon_wear !== undefined && (
                <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-1 py-0.5 rounded">
                  {getWearCondition(equippedSkin.weapon_wear)} ({Number(equippedSkin.weapon_wear).toFixed(3)})
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-500">
              Skin padrão (Default)
            </span>
          )}
        </div>
      </div>

      {/* Hover action bar */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-center gap-1.5 text-xs text-gray-400 group-hover:text-cs-gold transition-colors">
        <Edit3 size={13} />
        <span className="font-semibold">Personalizar Skin</span>
      </div>
    </div>
  );
}
