import React, { useState } from 'react';
import { Check, Scissors, Palette, Sparkles } from 'lucide-react';
import { playerService } from '../services/api';

export default function KnifeSelector({ 
  knives, 
  team, 
  equippedKnifeModel, 
  equippedSkins, 
  skinsMap,
  onKnifeChanged,
  onOpenSkinCustomizer 
}) {
  const [saving, setSaving] = useState(false);

  const handleSelectKnifeModel = async (knifeObj, e) => {
    if (e) e.stopPropagation();
    setSaving(true);
    try {
      await playerService.updateKnife(team, knifeObj.knife);
      onKnifeChanged(knifeObj.knife);
    } catch (err) {
      console.error('Erro ao equipar faca:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <Scissors size={22} className="text-cs-gold" />
            <span>★ FACAS DO COUNTER-STRIKE 2</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Clique em qualquer faca para ver e equipar skins (Doppler, Fade, Crimson Web) ou selecione o modelo.
          </p>
        </div>
      </div>

      {/* Knives Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {knives.map((k) => {
          const isEquipped = equippedKnifeModel === k.knife;
          const knifeSkin = equippedSkins?.[String(k.defindex)];
          const hasCustomSkin = !!knifeSkin && Number(knifeSkin.weapon_paint_id) > 0;
          
          // Busca detalhes da skin customizada equipada
          const skinInfo = hasCustomSkin ? skinsMap?.[`${k.defindex}_${knifeSkin.weapon_paint_id}`] : null;
          const displayedImage = skinInfo?.image || k.image;
          const displayedName = skinInfo?.paint_name || k.name;

          return (
            <div
              key={k.defindex}
              onClick={() => onOpenSkinCustomizer(k)}
              className={`group relative flex flex-col justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-md ${
                isEquipped
                  ? 'bg-gradient-to-b from-amber-500/15 via-cs-card to-cs-surface border-2 border-cs-gold shadow-gold'
                  : (hasCustomSkin 
                      ? 'bg-cs-card/90 border border-amber-500/40 hover:border-cs-gold' 
                      : 'bg-cs-card/70 border border-white/10 hover:bg-cs-card hover:border-white/20')
              }`}
            >
              {/* Top status */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold tracking-wider text-cs-gold uppercase">
                  ★ FACA
                </span>

                {isEquipped && (
                  <span className="flex items-center gap-1 text-[10px] font-extrabold bg-cs-gold text-black px-2 py-0.5 rounded-full shadow-gold">
                    <Check size={11} strokeWidth={3} /> MODELO ATIVO
                  </span>
                )}
              </div>

              {/* Knife Image */}
              <div className="w-full h-28 flex items-center justify-center my-2 overflow-hidden">
                <img
                  src={displayedImage}
                  alt={displayedName}
                  className="max-w-[190px] max-h-[95px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_butterfly.png';
                  }}
                />
              </div>

              {/* Knife Name */}
              <div className="w-full text-center my-2">
                <h4 className="text-sm font-extrabold text-white group-hover:text-cs-gold transition-colors line-clamp-1">
                  {displayedName}
                </h4>
                <span className={`text-[11px] block mt-0.5 ${hasCustomSkin ? 'text-cs-gold font-bold' : 'text-gray-400'}`}>
                  {hasCustomSkin ? `Paint ID: ${knifeSkin.weapon_paint_id}` : `${k.skins_count || 35} skins disponíveis`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full mt-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={(e) => handleSelectKnifeModel(k, e)}
                  disabled={saving}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    isEquipped
                      ? 'bg-cs-gold text-black hover:bg-amber-400'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isEquipped ? 'Equipada' : 'Usar Modelo'}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSkinCustomizer(k);
                  }}
                  className="p-1.5 rounded-lg border border-amber-500/40 text-cs-gold hover:bg-amber-500/20 transition-all"
                  title="Personalizar Pintura/Skin da Faca"
                >
                  <Palette size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
