from pathlib import Path
from PIL import Image

# Resolve caminhos relativos ao diretório do script
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
LOGOS_DIR = PROJECT_ROOT / 'assets' / 'images' / 'logos'
PRODUTOS_DIR = PROJECT_ROOT / 'assets' / 'images' / 'produtos'

# Configurações
INPUTS = [
    # Horizontal (fonte atual disponível):
    LOGOS_DIR / 'logo_alta.jpeg',
    # Compacto/quadrado (fonte atual disponível):
    LOGOS_DIR / 'Logo_Terra_noBack.png',
]

# Saída terá mesmo nome, extensão .webp, na mesma pasta
QUALITY = 90  # usada para non-lossless (não aplicaremos)
LOSSLESS = True  # manter exatamente as cores


def convert_to_webp(src_path: Path, out_name: str, dest_dir: Path | None = None):
    out_path = (dest_dir or src_path.parent) / out_name
    img = Image.open(src_path).convert('RGBA')

    # WebP lossless preserva áreas chapadas e texto com fidelidade
    img.save(out_path, format='WEBP', lossless=LOSSLESS, quality=QUALITY, method=6)
    print(f'Gerado: {out_path.relative_to(PROJECT_ROOT)}')


def main():
    any_converted = False
    # Logos
    for p in INPUTS:
        if not p.exists():
            print(f'[AVISO] Arquivo não encontrado: {p.relative_to(PROJECT_ROOT)}')
            continue
        # Mapear saída padronizada por arquivo fonte
        if p.name.lower().startswith('logo_alta'):
            out_name = 'terra-horizontal.webp'
        elif p.name.lower().startswith('logo_terra_noback'):
            out_name = 'terra-compact.webp'
        else:
            out_name = p.with_suffix('.webp').name

        convert_to_webp(p, out_name, LOGOS_DIR)
        any_converted = True

    # Produtos
    if PRODUTOS_DIR.exists():
        for ext in ('*.png', '*.jpg', '*.jpeg', '*.JPG', '*.PNG', '*.JPEG'):
            for img_path in PRODUTOS_DIR.glob(ext):
                out_name = img_path.with_suffix('.webp').name
                try:
                    convert_to_webp(img_path, out_name, img_path.parent)
                    any_converted = True
                except Exception as e:
                    print(f"[ERRO] Falha ao converter {img_path.name}: {e}")

    if not any_converted:
        print('Nenhum arquivo convertido. Verifique os caminhos em INPUTS e na pasta de produtos.')


if __name__ == '__main__':
    main()
