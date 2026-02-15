#!/usr/bin/env python3
"""
Fetch all RagnaTales videos from GekiGaming YouTube channel.
Classifies by class/build, checks thumbnails, and exports JSON + optional TS.

Usage:
    python fetch_ragnatales.py                # Gera JSON
    python fetch_ragnatales.py --generate-ts  # Gera JSON + constants_generated.ts
"""

import json
import re
import sys
import os
import subprocess
from datetime import datetime
from pathlib import Path

import requests

# ─── Config ───────────────────────────────────────────────────────────────────

CHANNEL_URL = "https://www.youtube.com/@gekigaming"
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_JSON = OUTPUT_DIR / "ragnatales_videos.json"
OUTPUT_TS = Path(__file__).parent.parent / "constants_generated.ts"

# Keywords that identify a RagnaTales video
RAGNATALES_KEYWORDS = [
    "ragnatales",
    "ragnatales.com.br",
    "ragna tales",
]

RAGNATALES_TAGS = {
    "ragnatales", "ragnarok", "ragnarokonline",
    "gypsy", "dancer", "gipsy", "trouvere",
    "mmorpg", "mmo", "rpg", "rmt",
}

# ─── Class Detection ─────────────────────────────────────────────────────────

CLASS_ALIASES = {
    "Atirador de Elite": [
        "atirador de elite", "sniper", "atirador", "arqueiro",
        "tiro preciso", "disparo violento", "tempestade de flechas",
        "rajada de flechas", "arrow storm", "sharp shooting",
        "double strafe", "hunter", "caçador",
    ],
    "Arquimago": [
        "arquimago", "arch mage", "archmage", "mago", "wizard",
        "bruxo", "campo gravitacional", "meteor storm",
        "tempestade de meteoros", "stave crasher", "high wizard",
    ],
    "Lorde": [
        "lorde", "lord knight", "espadachim", "cavaleiro",
        "knight", "impacto de tyr", "bash", "spiral pierce",
        "perfuração espiral", "two-hand sword",
    ],
    "Paladino": [
        "paladino", "paladin", "crux divinum", "grand cross",
        "cruz magnífica", "escudo sagrado", "autocast paladin",
        "crusader", "cruzado",
    ],
    "Criador": [
        "criador", "creator", "alquimista", "alchemist",
        "ácido", "acid demonstration", "homunculus",
        "tornado de carrinho", "terror ácido",
    ],
    "Mestre-Ferreiro": [
        "mestre-ferreiro", "mestre ferreiro", "whitesmith",
        "blacksmith", "ferreiro", "cart termination",
        "mammonite", "over thrust", "martelo de thor",
    ],
    "Sumo Sacerdote": [
        "sumo sacerdote", "high priest", "sacerdote",
        "priest", "padre", "clérigo", "acolyte",
        "magnus exorcismus", "adoramus", "heal bomb",
    ],
    "Mestre": [
        "mestre monge", "champion", "campeão", "monge", "monk",
        "asura strike", "dedo de buda", "combo monk",
        "investigação", "occult impaction", "mestre",
    ],
    "Algoz": [
        "algoz", "assassin cross", "assassino",
        "assassin", "sonic blow", "golpe sônico",
        "crit assassin", "katar", "envenenar",
    ],
    "Desordeiro": [
        "desordeiro", "stalker", "rogue",
        "disparo triplo", "plagiar", "bow rogue",
        "strip", "divest",
    ],
    "Professor": [
        "professor", "scholar", "sage", "sábio",
        "autocast professor", "soul burn", "mind breaker",
        "hindsight", "autospell",
    ],
    "Mestre Taekwon": [
        "mestre taekwon", "star gladiator", "taekwon master",
        "taekwon", "star emperor",
    ],
    "Cigana": [
        "cigana", "gypsy", "gipsy", "dançarina", "dancer",
        "trouvere", "odalisca",
    ],
    "Menestrel": [
        "menestrel", "minstrel", "bardo", "clown", "trovador",
        "músico", "bard", "vulcão",
    ],
    "Espiritualista": [
        "espiritualista", "soul linker", "soul reaper",
    ],
    "Ninja": [
        "ninja", "kagerou", "oboro", "shuriken",
        "ninjutsu",
    ],
    "Justiceiro": [
        "justiceiro", "gunslinger", "rebel", "rebelde",
        "pistoleiro",
    ],
    "Super Novice": [
        "super novice", "super noviço", "super aprendiz",
    ],
}

# Subcategory mapping (class → base job tree)
SUBCATEGORY_MAP = {
    "Atirador de Elite": "Arqueiro",
    "Arquimago": "Mago",
    "Lorde": "Espadachim",
    "Paladino": "Espadachim",
    "Criador": "Mercador",
    "Mestre-Ferreiro": "Mercador",
    "Sumo Sacerdote": "Noviço",
    "Mestre": "Noviço",
    "Algoz": "Gatuno",
    "Desordeiro": "Gatuno",
    "Professor": "Expandida",
    "Mestre Taekwon": "Expandida",
    "Cigana": "Expandida",
    "Menestrel": "Expandida",
    "Espiritualista": "Expandida",
    "Ninja": "Expandida",
    "Justiceiro": "Expandida",
    "Super Novice": "Expandida",
}

# ─── Content Category Detection (for uncategorized videos) ───────────────────

# Series detection runs FIRST (highest priority) - matches exact series titles
SERIES_PATTERNS = {
    "Do Zero ao RMT - Ragnatales": [
        "rmt do zero", "rmt do zero -",
        "renda extra na prática",
        "reserva de emergência",
        "ganhe dinheiro jogando",
        "verdade sobre o rmt",
    ],
    "Pai de Família": [
        "do zero à chefênia", "do zero a chefenia",
        "comecei do zero",
        "jornada das sombras",
        "guia de progressão do pai de família",
        "progressão do pai de família",
        "pai de família",
        "pai de familia",
        "nosso segundo dia do zero",
        "nossa primeira semana do zero",
    ],
}

CATEGORY_PATTERNS = {
    "Guias Essenciais": [
        "guia", "como progredir", "progressão", "iniciante",
        "tier list", "instância", "como começar",
        "consumíveis", "refino", "quest de acesso",
        "early game", "farmar", "farm", "moedas",
        "logue e ganhe", "força heróica", "passe de batalha",
        "classes mais", "melhor classe", "melhores classes",
        "manual de progressão", "atalhos", "talestools",
        "despertar", "verus", "skagos", "fortaleza",
        "medalhas do éden", "erros que iniciantes",
        "turbine seu farm", "convertir", "munições",
        "biblioteca de conteúdo",
    ],
    "Patch Notes": [
        "patch notes", "changelog",
        "novidades para personagens", "patch note",
        "novo sistema", "mapas especiais",
        "changelog ",  # with trailing space to avoid false matches
    ],
}


def detect_content_category(video: dict) -> str:
    """Detect content category for videos without a class.
    Series detection runs first with higher priority.
    """
    title = (video.get("title") or "").lower()
    description = (video.get("description") or "").lower()
    text = f"{title} {description}"

    # Phase 1: Try to match a specific series (highest priority)
    for category, patterns in SERIES_PATTERNS.items():
        for pattern in patterns:
            if pattern in title:
                return category

    # Phase 2: General category matching with scoring
    scores: dict[str, int] = {}
    for category, patterns in CATEGORY_PATTERNS.items():
        score = 0
        for pattern in patterns:
            if pattern in title:
                score += 3
            elif pattern in text:
                score += 1
        if score > 0:
            scores[category] = score

    if not scores:
        return "Outros"

    return max(scores, key=scores.get)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def fetch_channel_videos() -> list[dict]:
    """Use yt-dlp to fetch all video metadata from the channel."""
    print(f"[1/4] Buscando vídeos do canal {CHANNEL_URL} ...")

    cmd = [
        "yt-dlp",
        "--flat-playlist",
        "--dump-json",
        "--no-warnings",
        "--extractor-args", "youtube:lang=pt",
        f"{CHANNEL_URL}/videos",
    ]

    result = subprocess.run(
        cmd, capture_output=True, text=True, encoding="utf-8"
    )

    if result.returncode != 0:
        print(f"Erro yt-dlp (flat): {result.stderr[:500]}")
        print("Tentando busca completa (mais lenta)...")
        # Fallback: extract full info for each video
        cmd_full = [
            "yt-dlp",
            "--dump-json",
            "--no-download",
            "--no-warnings",
            "--extractor-args", "youtube:lang=pt",
            f"{CHANNEL_URL}/videos",
        ]
        result = subprocess.run(
            cmd_full, capture_output=True, text=True, encoding="utf-8"
        )
        if result.returncode != 0:
            print(f"Erro fatal yt-dlp: {result.stderr[:500]}")
            sys.exit(1)

    videos = []
    for line in result.stdout.strip().split("\n"):
        if line.strip():
            try:
                videos.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    print(f"   Encontrados {len(videos)} vídeos no canal.")
    return videos


def needs_full_metadata(videos: list[dict]) -> bool:
    """Check if we got flat playlist data (no description) and need full fetch."""
    if not videos:
        return False
    sample = videos[0]
    # flat-playlist entries often lack 'description' or 'tags'
    return "description" not in sample and "tags" not in sample


def fetch_full_metadata(video_ids: list[str]) -> list[dict]:
    """Fetch full metadata for specific video IDs."""
    print(f"[1.5/4] Buscando metadados completos de {len(video_ids)} vídeos...")

    full_videos = []
    for i, vid_id in enumerate(video_ids):
        url = f"https://www.youtube.com/watch?v={vid_id}"
        cmd = [
            "yt-dlp",
            "--dump-json",
            "--no-download",
            "--no-warnings",
            url,
        ]
        result = subprocess.run(
            cmd, capture_output=True, text=True, encoding="utf-8"
        )
        if result.returncode == 0 and result.stdout.strip():
            try:
                data = json.loads(result.stdout.strip())
                full_videos.append(data)
            except json.JSONDecodeError:
                pass

        if (i + 1) % 10 == 0:
            print(f"   ... {i + 1}/{len(video_ids)} processados")

    return full_videos


def is_ragnatales_video(video: dict) -> bool:
    """Check if a video is related to RagnaTales."""
    title = (video.get("title") or "").lower()
    description = (video.get("description") or "").lower()
    tags = [t.lower() for t in (video.get("tags") or [])]

    # Check title and description for keywords
    text = f"{title} {description}"
    for kw in RAGNATALES_KEYWORDS:
        if kw in text:
            return True

    # Check tags
    for tag in tags:
        if tag in RAGNATALES_TAGS:
            return True
        # Also check without # prefix
        clean_tag = tag.lstrip("#")
        if clean_tag in RAGNATALES_TAGS:
            return True

    return False


def detect_class(video: dict) -> tuple[str | None, str | None]:
    """Detect the Ragnarok class from video title/description.
    Returns (class_name, subcategory) or (None, None).
    """
    title = (video.get("title") or "").lower()
    description = (video.get("description") or "").lower()
    text = f"{title} {description}"

    # Exclude generic videos that mention classes but aren't class-specific
    generic_patterns = [
        "tier list", "melhores classes", "melhor classe",
        "todas as vocações", "todas as classes",
    ]
    if any(p in title for p in generic_patterns):
        return None, None

    # Score each class by number of keyword matches
    scores: dict[str, int] = {}
    for class_name, aliases in CLASS_ALIASES.items():
        score = 0
        for alias in aliases:
            # Use word boundary matching for short aliases to avoid false positives
            # e.g. "mestre" in "mestre-ferreiro" should not match "Mestre" (Champion)
            if len(alias) <= 7:
                # Short alias: require it as standalone word in title
                pattern = r'\b' + re.escape(alias) + r'\b'
                if re.search(pattern, title):
                    score += 3
                elif re.search(pattern, description):
                    score += 1
            else:
                if alias in text:
                    if alias in title:
                        score += 3
                    else:
                        score += 1
        if score > 0:
            scores[class_name] = score

    if not scores:
        return None, None

    best_class = max(scores, key=scores.get)
    subcategory = SUBCATEGORY_MAP.get(best_class, "Outros")
    return best_class, subcategory


def check_thumbnail(video_id: str) -> tuple[str, str]:
    """Return (primary_url, fallback_url) for the video thumbnail.
    Checks if maxresdefault exists, otherwise uses hqdefault.
    """
    maxres = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
    hqdefault = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

    try:
        resp = requests.head(maxres, timeout=5, allow_redirects=True)
        if resp.status_code == 200:
            content_length = resp.headers.get("content-length", "0")
            # YouTube returns a small placeholder for missing maxres thumbnails
            if int(content_length) > 2000:
                return maxres, hqdefault
    except requests.RequestException:
        pass

    return hqdefault, hqdefault


def process_videos(videos: list[dict]) -> dict:
    """Filter, classify and organize RagnaTales videos."""
    print(f"[2/4] Filtrando vídeos de RagnaTales...")

    ragnatales = [v for v in videos if is_ragnatales_video(v)]
    print(f"   {len(ragnatales)} vídeos de RagnaTales encontrados.")

    # If we only have flat data, fetch full metadata for filtered videos
    if ragnatales and needs_full_metadata(ragnatales):
        ids = [v.get("id") for v in ragnatales if v.get("id")]
        ragnatales = fetch_full_metadata(ids)
        # Re-filter with full data
        ragnatales = [v for v in ragnatales if is_ragnatales_video(v)]
        print(f"   Após re-filtro com metadados completos: {len(ragnatales)} vídeos.")

    print(f"[3/4] Classificando por classe e verificando thumbnails...")

    classes: dict[str, list[dict]] = {}
    uncategorized: list[dict] = []

    for i, video in enumerate(ragnatales):
        vid_id = video.get("id", "")
        title = video.get("title", "Sem título")
        description = video.get("description", "")
        tags = video.get("tags") or []
        upload_date = video.get("upload_date", "")

        # Format date
        formatted_date = ""
        if upload_date and len(upload_date) == 8:
            try:
                formatted_date = f"{upload_date[:4]}-{upload_date[4:6]}-{upload_date[6:8]}"
            except (ValueError, IndexError):
                formatted_date = upload_date

        # Check thumbnail
        thumb_url, thumb_fallback = check_thumbnail(vid_id)

        # Detect class
        detected_class, subcategory = detect_class(video)

        entry = {
            "id": vid_id,
            "title": title,
            "description": description[:300] if description else "",
            "videoUrl": f"https://www.youtube.com/watch?v={vid_id}",
            "thumbnailUrl": thumb_url,
            "thumbnailFallback": thumb_fallback,
            "uploadDate": formatted_date,
            "tags": tags[:15],  # limit tags
        }

        if detected_class:
            entry["class"] = detected_class
            entry["subcategory"] = subcategory
            entry["contentCategory"] = "Builds"
            if detected_class not in classes:
                classes[detected_class] = []
            classes[detected_class].append(entry)
        else:
            # Curate into content categories
            content_cat = detect_content_category(video)
            entry["contentCategory"] = content_cat
            uncategorized.append(entry)

        if (i + 1) % 5 == 0:
            print(f"   ... {i + 1}/{len(ragnatales)} processados")

    # Sort builds within each class by upload date (newest first)
    for class_name in classes:
        classes[class_name].sort(
            key=lambda x: x.get("uploadDate", ""), reverse=True
        )

    total = sum(len(builds) for builds in classes.values()) + len(uncategorized)

    return {
        "classes": classes,
        "uncategorized": uncategorized,
        "totalVideos": total,
        "fetchDate": datetime.now().strftime("%Y-%m-%d"),
    }


def save_json(data: dict):
    """Save results to JSON."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[4/4] JSON salvo em: {OUTPUT_JSON}")
    print(f"\n{'='*50}")
    print(f"  Total de vídeos: {data['totalVideos']}")
    print(f"  Classes encontradas: {len(data['classes'])}")
    for cls, builds in sorted(data["classes"].items()):
        print(f"    - {cls}: {len(builds)} vídeo(s)")
    if data["uncategorized"]:
        # Group uncategorized by content category
        cat_counts: dict[str, int] = {}
        for v in data["uncategorized"]:
            cat = v.get("contentCategory", "Outros")
            cat_counts[cat] = cat_counts.get(cat, 0) + 1
        print(f"  Vídeos por categoria de conteúdo:")
        for cat, count in sorted(cat_counts.items()):
            print(f"    - {cat}: {count} vídeo(s)")
    print(f"{'='*50}")


def generate_typescript(data: dict):
    """Generate a constants_generated.ts file from the JSON data."""
    print(f"\nGerando TypeScript em: {OUTPUT_TS}")

    lines = [
        '// Auto-generated by fetch_ragnatales.py',
        f'// Generated on: {data["fetchDate"]}',
        f'// Total videos: {data["totalVideos"]}',
        '',
        'import { BuildGuide } from "./types";',
        '',
        'export const RAGNATALES_BUILDS: BuildGuide[] = [',
    ]

    idx = 1
    # Classified videos (Builds)
    for class_name, builds in sorted(data["classes"].items()):
        lines.append(f'  // --- {class_name} ---')
        for build in builds:
            lines.append('  {')
            lines.append(f'    id: "ragna-{idx}",')
            lines.append(f'    category: "Builds",')
            subcategory = build.get("subcategory", "Outros")
            lines.append(f'    subcategory: "{subcategory}",')
            title_escaped = build["title"].replace('"', '\\"')
            lines.append(f'    title: "{title_escaped}",')
            lines.append(f'    class: "{class_name}",')
            lines.append(f'    author: "GekiGaming",')
            desc = build.get("description", "")[:200].replace('"', '\\"').replace("\n", " ")
            lines.append(f'    description: "{desc}",')
            lines.append(f'    imageUrl: "{build["thumbnailUrl"]}",')
            lines.append(f'    fallbackImageUrl: "{build["thumbnailFallback"]}",')
            lines.append(f'    videoUrl: "{build["videoUrl"]}",')
            tags_str = json.dumps(build.get("tags", [])[:5], ensure_ascii=False)
            lines.append(f'    tags: {tags_str},')
            lines.append('  },')
            idx += 1

    # Curated content categories
    if data["uncategorized"]:
        # Group by content category
        by_category: dict[str, list] = {}
        for build in data["uncategorized"]:
            cat = build.get("contentCategory", "Outros")
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(build)

        for cat_name, builds in sorted(by_category.items()):
            if cat_name == "Outros":
                continue  # Skip non-RagnaTales content
            lines.append(f'  // --- {cat_name} ---')
            for build in builds:
                lines.append('  {')
                lines.append(f'    id: "ragna-{idx}",')
                # Map category name to ContentCategory type
                ts_category = cat_name
                lines.append(f'    category: "{ts_category}",')
                title_escaped = build["title"].replace('"', '\\"')
                lines.append(f'    title: "{title_escaped}",')
                lines.append(f'    author: "GekiGaming",')
                desc = build.get("description", "")[:200].replace('"', '\\"').replace("\n", " ")
                lines.append(f'    description: "{desc}",')
                lines.append(f'    imageUrl: "{build["thumbnailUrl"]}",')
                lines.append(f'    fallbackImageUrl: "{build["thumbnailFallback"]}",')
                lines.append(f'    videoUrl: "{build["videoUrl"]}",')
                tags_str = json.dumps(build.get("tags", [])[:5], ensure_ascii=False)
                lines.append(f'    tags: {tags_str},')
                lines.append('  },')
                idx += 1

    lines.append('];')
    lines.append('')

    with open(OUTPUT_TS, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"TypeScript gerado com {idx - 1} builds.")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    generate_ts = "--generate-ts" in sys.argv

    # Step 1: Fetch all videos
    videos = fetch_channel_videos()

    if not videos:
        print("Nenhum vídeo encontrado. Verifique se yt-dlp está instalado.")
        sys.exit(1)

    # Step 2-3: Filter, classify, check thumbnails
    data = process_videos(videos)

    if data["totalVideos"] == 0:
        print("Nenhum vídeo de RagnaTales encontrado.")
        sys.exit(0)

    # Step 4: Save
    save_json(data)

    # Optional: Generate TypeScript
    if generate_ts:
        generate_typescript(data)

    print("\nDone!")


if __name__ == "__main__":
    main()
