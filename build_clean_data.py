import sys
import os
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

def fetch_json(url):
    print(f"Baixando: {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode('utf-8'))

WEAPON_MAP = {
    # Pistols
    "weapon_deagle": {"defindex": 1, "name": "Desert Eagle", "category": "pistols", "team": "any", "api_name": "Desert Eagle", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_deagle.png"},
    "weapon_elite": {"defindex": 2, "name": "Dual Berettas", "category": "pistols", "team": "any", "api_name": "Dual Berettas", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_elite.png"},
    "weapon_fiveseven": {"defindex": 3, "name": "Five-SeveN", "category": "pistols", "team": "ct", "api_name": "Five-SeveN", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_fiveseven.png"},
    "weapon_glock": {"defindex": 4, "name": "Glock-18", "category": "pistols", "team": "t", "api_name": "Glock-18", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_glock.png"},
    "weapon_tec9": {"defindex": 30, "name": "Tec-9", "category": "pistols", "team": "t", "api_name": "Tec-9", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_tec9.png"},
    "weapon_taser": {"defindex": 31, "name": "Zeus x27", "category": "pistols", "team": "any", "api_name": "Zeus x27", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_taser.png"},
    "weapon_hkp2000": {"defindex": 32, "name": "P2000", "category": "pistols", "team": "ct", "api_name": "P2000", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_hkp2000.png"},
    "weapon_p250": {"defindex": 36, "name": "P250", "category": "pistols", "team": "any", "api_name": "P250", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_p250.png"},
    "weapon_usp_silencer": {"defindex": 61, "name": "USP-S", "category": "pistols", "team": "ct", "api_name": "USP-S", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_usp_silencer.png"},
    "weapon_cz75a": {"defindex": 63, "name": "CZ75-Auto", "category": "pistols", "team": "any", "api_name": "CZ75-Auto", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_cz75a.png"},
    "weapon_revolver": {"defindex": 64, "name": "R8 Revolver", "category": "pistols", "team": "any", "api_name": "R8 Revolver", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_revolver.png"},
    
    # Rifles
    "weapon_ak47": {"defindex": 7, "name": "AK-47", "category": "rifles", "team": "t", "api_name": "AK-47", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ak47.png"},
    "weapon_aug": {"defindex": 8, "name": "AUG", "category": "rifles", "team": "ct", "api_name": "AUG", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_aug.png"},
    "weapon_famas": {"defindex": 10, "name": "FAMAS", "category": "rifles", "team": "ct", "api_name": "FAMAS", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_famas.png"},
    "weapon_galilar": {"defindex": 13, "name": "Galil AR", "category": "rifles", "team": "t", "api_name": "Galil AR", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_galilar.png"},
    "weapon_m4a1": {"defindex": 16, "name": "M4A4", "category": "rifles", "team": "ct", "api_name": "M4A4", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_m4a1.png"},
    "weapon_m4a1_silencer": {"defindex": 60, "name": "M4A1-S", "category": "rifles", "team": "ct", "api_name": "M4A1-S", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_m4a1_silencer.png"},
    "weapon_sg556": {"defindex": 39, "name": "SG 553", "category": "rifles", "team": "t", "api_name": "SG 553", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_sg556.png"},
    
    # Snipers
    "weapon_awp": {"defindex": 9, "name": "AWP", "category": "sniper_rifles", "team": "any", "api_name": "AWP", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_awp.png"},
    "weapon_g3sg1": {"defindex": 11, "name": "G3SG1", "category": "sniper_rifles", "team": "t", "api_name": "G3SG1", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_g3sg1.png"},
    "weapon_scar20": {"defindex": 38, "name": "SCAR-20", "category": "sniper_rifles", "team": "ct", "api_name": "SCAR-20", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_scar20.png"},
    "weapon_ssg08": {"defindex": 40, "name": "SSG 08", "category": "sniper_rifles", "team": "any", "api_name": "SSG 08", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ssg08.png"},
    
    # SMGs
    "weapon_mac10": {"defindex": 17, "name": "MAC-10", "category": "smg", "team": "t", "api_name": "MAC-10", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_mac10.png"},
    "weapon_p90": {"defindex": 19, "name": "P90", "category": "smg", "team": "any", "api_name": "P90", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_p90.png"},
    "weapon_mp5sd": {"defindex": 23, "name": "MP5-SD", "category": "smg", "team": "any", "api_name": "MP5-SD", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_mp5sd.png"},
    "weapon_ump45": {"defindex": 24, "name": "UMP-45", "category": "smg", "team": "any", "api_name": "UMP-45", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_ump45.png"},
    "weapon_bizon": {"defindex": 26, "name": "PP-Bizon", "category": "smg", "team": "any", "api_name": "PP-Bizon", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_bizon.png"},
    "weapon_mp7": {"defindex": 33, "name": "MP7", "category": "smg", "team": "any", "api_name": "MP7", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_mp7.png"},
    "weapon_mp9": {"defindex": 34, "name": "MP9", "category": "smg", "team": "ct", "api_name": "MP9", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_mp9.png"},
    
    # Shotguns
    "weapon_xm1014": {"defindex": 25, "name": "XM1014", "category": "shotguns", "team": "any", "api_name": "XM1014", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_xm1014.png"},
    "weapon_mag7": {"defindex": 27, "name": "MAG-7", "category": "shotguns", "team": "ct", "api_name": "MAG-7", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_mag7.png"},
    "weapon_sawedoff": {"defindex": 29, "name": "Sawed-Off", "category": "shotguns", "team": "t", "api_name": "Sawed-Off", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_sawedoff.png"},
    "weapon_nova": {"defindex": 35, "name": "Nova", "category": "shotguns", "team": "any", "api_name": "Nova", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_nova.png"},
    
    # Machine Guns
    "weapon_m249": {"defindex": 14, "name": "M249", "category": "machine_guns", "team": "any", "api_name": "M249", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_m249.png"},
    "weapon_negev": {"defindex": 28, "name": "Negev", "category": "machine_guns", "team": "any", "api_name": "Negev", "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_negev.png"},
}

KNIVES_MAP = {
    "weapon_bayonet": {"defindex": 500, "name": "★ Bayonet", "aliases": ["Bayonet", "★ Bayonet"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_bayonet.png"},
    "weapon_knife_css": {"defindex": 503, "name": "★ Classic Knife", "aliases": ["Classic Knife", "★ Classic Knife"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_css.png"},
    "weapon_knife_flip": {"defindex": 505, "name": "★ Flip Knife", "aliases": ["Flip Knife", "★ Flip Knife"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_flip.png"},
    "weapon_knife_gut": {"defindex": 506, "name": "★ Gut Knife", "aliases": ["Gut Knife", "★ Gut Knife"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_gut.png"},
    "weapon_knife_karambit": {"defindex": 507, "name": "★ Karambit", "aliases": ["Karambit", "★ Karambit"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_karambit.png"},
    "weapon_knife_m9_bayonet": {"defindex": 508, "name": "★ M9 Bayonet", "aliases": ["M9 Bayonet", "★ M9 Bayonet"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_m9_bayonet.png"},
    "weapon_knife_tactical": {"defindex": 509, "name": "★ Huntsman Knife", "aliases": ["Huntsman Knife", "★ Huntsman Knife", "Huntsman"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_tactical.png"},
    "weapon_knife_falchion": {"defindex": 512, "name": "★ Falchion Knife", "aliases": ["Falchion Knife", "★ Falchion Knife", "Falchion"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_falchion.png"},
    "weapon_knife_survival_bowie": {"defindex": 514, "name": "★ Bowie Knife", "aliases": ["Bowie Knife", "★ Bowie Knife", "Bowie"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_survival_bowie.png"},
    "weapon_knife_butterfly": {"defindex": 515, "name": "★ Butterfly Knife", "aliases": ["Butterfly Knife", "★ Butterfly Knife", "Butterfly"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_butterfly.png"},
    "weapon_knife_push": {"defindex": 516, "name": "★ Shadow Daggers", "aliases": ["Shadow Daggers", "★ Shadow Daggers"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_push.png"},
    "weapon_knife_cord": {"defindex": 517, "name": "★ Paracord Knife", "aliases": ["Paracord Knife", "★ Paracord Knife", "Paracord"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_cord.png"},
    "weapon_knife_canis": {"defindex": 518, "name": "★ Survival Knife", "aliases": ["Survival Knife", "★ Survival Knife", "Survival"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_canis.png"},
    "weapon_knife_ursus": {"defindex": 519, "name": "★ Ursus Knife", "aliases": ["Ursus Knife", "★ Ursus Knife", "Ursus"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_ursus.png"},
    "weapon_knife_gypsy_jackknife": {"defindex": 520, "name": "★ Navaja Knife", "aliases": ["Navaja Knife", "★ Navaja Knife", "Navaja"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_gypsy_jackknife.png"},
    "weapon_knife_outdoor": {"defindex": 521, "name": "★ Nomad Knife", "aliases": ["Nomad Knife", "★ Nomad Knife", "Nomad"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_outdoor.png"},
    "weapon_knife_stiletto": {"defindex": 522, "name": "★ Stiletto Knife", "aliases": ["Stiletto Knife", "★ Stiletto Knife", "Stiletto"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_stiletto.png"},
    "weapon_knife_widowmaker": {"defindex": 523, "name": "★ Talon Knife", "aliases": ["Talon Knife", "★ Talon Knife", "Talon"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_widowmaker.png"},
    "weapon_knife_skeleton": {"defindex": 525, "name": "★ Skeleton Knife", "aliases": ["Skeleton Knife", "★ Skeleton Knife", "Skeleton"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_skeleton.png"},
    "weapon_knife_kukri": {"defindex": 526, "name": "★ Kukri Knife", "aliases": ["Kukri Knife", "★ Kukri Knife", "Kukri"], "image": "https://raw.githubusercontent.com/Nereziel/cs2-WeaponPaints/main/website/img/skins/weapon_knife_kukri.png"},
}

GLOVES_MAP = {
    "Bloodhound Gloves": {"defindex": 5027, "name": "★ Bloodhound Gloves"},
    "Default Gloves": {"defindex": 4725, "name": "★ Default Gloves"},
    "Sport Gloves": {"defindex": 5030, "name": "★ Sport Gloves"},
    "Driver Gloves": {"defindex": 5031, "name": "★ Driver Gloves"},
    "Hand Wraps": {"defindex": 5032, "name": "★ Hand Wraps"},
    "Moto Gloves": {"defindex": 5033, "name": "★ Moto Gloves"},
    "Specialist Gloves": {"defindex": 5034, "name": "★ Specialist Gloves"},
    "Hydra Gloves": {"defindex": 5035, "name": "★ Hydra Gloves"},
    "Broken Fang Gloves": {"defindex": 4725, "name": "★ Broken Fang Gloves"}
}

def main():
    raw_skins = fetch_json('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json')
    raw_agents = fetch_json('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/agents.json')
    raw_music = fetch_json('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/music_kits.json')
    
    print(f"API retornou {len(raw_skins)} skins, {len(raw_agents)} agentes, {len(raw_music)} music kits.")

    # 2. Build weapons.json
    weapons_list = []
    for wname, info in WEAPON_MAP.items():
        weapons_list.append({
            "defindex": info["defindex"],
            "name": info["name"],
            "weapon_name": wname,
            "category": info["category"],
            "team": info["team"],
            "image": info["image"]
        })
        
    # 3. Build knives.json
    knives_list = []
    for kname, info in KNIVES_MAP.items():
        knives_list.append({
            "defindex": info["defindex"],
            "name": info["name"],
            "knife": kname,
            "image": info["image"]
        })

    # 4. Map API skins into our unified skins.json format
    unified_skins = []
    
    # Add default (paint=0) skins
    for w in weapons_list:
        unified_skins.append({
            "weapon_defindex": w["defindex"],
            "weapon_name": w["weapon_name"],
            "paint": "0",
            "paint_name": f"{w['name']} | Padrão (Default)",
            "image": w["image"],
            "rarity_name": "Padrão",
            "rarity_color": "#b0c3d9"
        })
        
    for k in knives_list:
        unified_skins.append({
            "weapon_defindex": k["defindex"],
            "weapon_name": k["knife"],
            "paint": "0",
            "paint_name": f"{k['name']} | Padrão (Default)",
            "image": k["image"],
            "rarity_name": "★ Covert",
            "rarity_color": "#ffd700"
        })

    # Map all skins from ByMykel API
    for item in raw_skins:
        w_obj = item.get("weapon") or {}
        w_name = w_obj.get("name", "")
        w_id = w_obj.get("id", "")
        paint_idx = str(item.get("paint_index", ""))
        img = item.get("image")
        name = item.get("name", "")
        rarity = item.get("rarity") or {}
        cat_obj = item.get("category") or {}
        cat_name = cat_obj.get("name", "")
        
        if not paint_idx or paint_idx == "None" or not img:
            continue
            
        # Match regular weapon
        matched_wkey = next((k for k, v in WEAPON_MAP.items() if v["api_name"] == w_name or v["name"] == w_name or k == w_id), None)
        if matched_wkey:
            winfo = WEAPON_MAP[matched_wkey]
            unified_skins.append({
                "weapon_defindex": winfo["defindex"],
                "weapon_name": matched_wkey,
                "paint": paint_idx,
                "paint_name": name,
                "image": img,
                "rarity_name": rarity.get("name", "Skin"),
                "rarity_color": rarity.get("color", "#d32ce6")
            })
            continue

        # Match knife
        matched_kkey = None
        for kname, kinfo in KNIVES_MAP.items():
            if w_id == kname or w_name in kinfo["aliases"] or any(alias.lower() in name.lower() for alias in kinfo["aliases"]):
                matched_kkey = kname
                break
                
        if matched_kkey and (cat_name == "Knives" or "★" in name or "Knife" in name or "Bayonet" in name or "Karambit" in name or "Daggers" in name):
            kinfo = KNIVES_MAP[matched_kkey]
            unified_skins.append({
                "weapon_defindex": kinfo["defindex"],
                "weapon_name": matched_kkey,
                "paint": paint_idx,
                "paint_name": name,
                "image": img,
                "rarity_name": "★ Covert",
                "rarity_color": "#ffd700"
            })
            continue

    # 5. Build gloves.json and gloves skins
    gloves_list = []
    for item in raw_skins:
        cat = item.get("category") or {}
        if cat.get("name") == "Gloves" or "Gloves" in item.get("name", "") or "Hand Wraps" in item.get("name", ""):
            gname = item.get("name", "")
            img = item.get("image", "")
            paint = item.get("paint_index", "0")
            
            matched_type = "Default Gloves"
            for gtype in GLOVES_MAP.keys():
                if gtype.lower() in gname.lower():
                    matched_type = gtype
                    break
                    
            glove_info = GLOVES_MAP[matched_type]
            gloves_list.append({
                "weapon_defindex": glove_info["defindex"],
                "name": gname,
                "paint_name": gname,
                "paint": str(paint),
                "glove_type": glove_info["name"],
                "image": img
            })

    # 6. Build agents.json
    agents_list = []
    for item in raw_agents:
        team_str = "t" if "terrorist" in item.get("team", {}).get("name", "").lower() else "ct"
        agents_list.append({
            "agent_id": item.get("id"),
            "name": item.get("name"),
            "team": team_str,
            "rarity": item.get("rarity", {}).get("name", "Superior"),
            "image": item.get("image")
        })

    # 7. Build music.json
    music_list = []
    for idx, item in enumerate(raw_music):
        music_list.append({
            "music_id": idx + 1,
            "name": item.get("name"),
            "image": item.get("image")
        })

    print(f"Total gerado -> Skins: {len(unified_skins)}, Armas: {len(weapons_list)}, Facas: {len(knives_list)}, Luvas: {len(gloves_list)}, Agentes: {len(agents_list)}, Music: {len(music_list)}")

    # Salvar em backend/data/ e data/
    for out_dir in ["backend/data", "data"]:
        os.makedirs(out_dir, exist_ok=True)
        with open(f"{out_dir}/weapons.json", "w", encoding="utf-8") as f:
            json.dump(weapons_list, f, indent=2, ensure_ascii=False)
        with open(f"{out_dir}/knives.json", "w", encoding="utf-8") as f:
            json.dump(knives_list, f, indent=2, ensure_ascii=False)
        with open(f"{out_dir}/gloves.json", "w", encoding="utf-8") as f:
            json.dump(gloves_list, f, indent=2, ensure_ascii=False)
        with open(f"{out_dir}/agents.json", "w", encoding="utf-8") as f:
            json.dump(agents_list, f, indent=2, ensure_ascii=False)
        with open(f"{out_dir}/music.json", "w", encoding="utf-8") as f:
            json.dump(music_list, f, indent=2, ensure_ascii=False)
        with open(f"{out_dir}/skins.json", "w", encoding="utf-8") as f:
            json.dump(unified_skins, f, indent=2, ensure_ascii=False)

    print("Todos os arquivos JSON em backend/data/ e data/ atualizados com sucesso!")

if __name__ == "__main__":
    main()
