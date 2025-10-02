#!/usr/bin/env python3
"""
Script para atualizar a versão do site Terra Eletrônica
Atualiza automaticamente o arquivo version.json com nova versão e data
Suporta formato de versão com cinco segmentos: major.minor.patch.build.revision
"""

import json
import os
import re
import sys
from datetime import datetime
import argparse

def get_version_file_path():
    """Retorna o caminho para o arquivo version.json"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(script_dir, 'version.json')


def get_sw_file_path():
    """Retorna o caminho para o arquivo sw.js"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(script_dir, 'sw.js')


VERSION_CONSTANT_NAME = 'SITE_VERSION'
VERSION_PATTERN = re.compile(rf"(const\\s+{VERSION_CONSTANT_NAME}\\s*=\\s*)(['\"])([^'\"]+)(['\"])(\\s*;)")

def load_sw_version():
    """Lê a versão definida dentro do arquivo sw.js"""
    sw_file = get_sw_file_path()

    if not os.path.exists(sw_file):
        return None

    try:
        with open(sw_file, 'r', encoding='utf-8') as handler:
            content = handler.read()
    except OSError:
        return None

    match = VERSION_PATTERN.search(content)
    if match:
        return match.group(3).strip()
    return None

def write_sw_version(new_version):
    """Atualiza a constante de versão dentro de sw.js"""
    sw_file = get_sw_file_path()

    if not os.path.exists(sw_file):
        return False

    try:
        with open(sw_file, 'r', encoding='utf-8') as handler:
            content = handler.read()
    except OSError:
        return False

    match = VERSION_PATTERN.search(content)
    if not match:
        return False

    def _replacement(matched):
        return f"{matched.group(1)}{matched.group(2)}{new_version}{matched.group(4)}{matched.group(5)}"

    updated_content = VERSION_PATTERN.sub(_replacement, content, count=1)

    try:
        with open(sw_file, 'w', encoding='utf-8') as handler:
            handler.write(updated_content)
    except OSError:
        return False

    return True
def load_current_version():
    """Carrega a versão atual do arquivo version.json"""
    version_file = get_version_file_path()
    
    if not os.path.exists(version_file):
        return {"version": "1.0.0.0.0", "updated": datetime.now().strftime("%Y-%m-%d")}
    
    try:
        with open(version_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {"version": "1.0.0.0.0", "updated": datetime.now().strftime("%Y-%m-%d")}

def normalize_version(version):
    """Normaliza uma versão para o formato major.minor.patch.build.revision"""
    if not version:
        return "1.0.0.0.0"
    parts = str(version).split('.')
    if len(parts) == 3:
        parts.extend(['0', '0'])
    elif len(parts) != 5:
        raise ValueError(f"Formato de versão inesperado: {version}")
    if not all(part.isdigit() for part in parts):
        raise ValueError(f"Versão contém caracteres inválidos: {version}")
    return '.'.join(parts)

def increment_version(current_version, increment_type='patch'):
    """Incrementa a versão seguindo o padrão 5 números (major.minor.patch.build.revision)"""
    try:
        parts = current_version.split('.')
        
        # Suporta tanto formato antigo (3 números) quanto novo (5 números)
        if len(parts) == 3:
            major, minor, patch = map(int, parts)
            build, revision = 0, 0
        elif len(parts) == 5:
            major, minor, patch, build, revision = map(int, parts)
        else:
            raise ValueError("Formato inválido")
        
        if increment_type == 'major':
            major += 1
            minor = 0
            patch = 0
            build = 0
            revision = 0
        elif increment_type == 'minor':
            minor += 1
            patch = 0
            build = 0  
            revision = 0
        elif increment_type == 'build':
            build += 1
            revision = 0
        elif increment_type == 'revision':
            revision += 1
        else:  # patch (padrão)
            patch += 1
            build = 0
            revision = 0
            
        return f"{major}.{minor}.{patch}.{build}.{revision}"
    except ValueError:
        print(f"Erro: Versão atual '{current_version}' não está no formato correto (major.minor.patch.build.revision)")
        return None

def save_version(version_data):
    """Salva a nova versão no arquivo version.json"""
    version_file = get_version_file_path()
    
    try:
        with open(version_file, 'w', encoding='utf-8') as f:
            json.dump(version_data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Erro ao salvar arquivo de versão: {e}")
        return False

def update_package_json_version(new_version):
    """Atualiza a versão no package.json se existir"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    package_file = os.path.join(script_dir, 'package.json')
    
    if os.path.exists(package_file):
        try:
            with open(package_file, 'r', encoding='utf-8') as f:
                package_data = json.load(f)
            
            package_data['version'] = new_version
            
            with open(package_file, 'w', encoding='utf-8') as f:
                json.dump(package_data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ package.json atualizado para versão {new_version}")
            return True
        except Exception as e:
            print(f"⚠️  Erro ao atualizar package.json: {e}")
            return False
    else:
        print("ℹ️  package.json não encontrado - pulando atualização")
        return True


def sync_versions_from_sw():
    """Sincroniza version.json e package.json usando a versão presente em sw.js"""
    sw_version_raw = load_sw_version()
    if sw_version_raw is None:
        print(f"Erro: Não foi possível localizar a constante {VERSION_CONSTANT_NAME} em sw.js.")
        return 1

    try:
        sw_version = normalize_version(sw_version_raw)
    except ValueError as exc:
        print(f"Erro: {exc}")
        return 1

    if sw_version != sw_version_raw:
        if write_sw_version(sw_version):
            print(f"ℹ️  Versão em sw.js normalizada para {sw_version}")
        else:
            print(f"⚠️  Não foi possível normalizar a versão em sw.js para {sw_version}")

    current_data = load_current_version()
    previous_version_raw = current_data.get('version')
    try:
        previous_version = normalize_version(previous_version_raw)
    except ValueError:
        previous_version = previous_version_raw or sw_version

    if previous_version == sw_version:
        print(f"✅ Nenhuma alteração necessária: versão {sw_version} já sincronizada.")
        update_package_json_version(sw_version)
        return 0

    new_data = {
        "version": sw_version,
        "updated": datetime.now().strftime("%Y-%m-%d"),
        "previous_version": previous_version,
        "changelog": f"Sincronizado com sw.js ({previous_version} → {sw_version})"
    }

    if save_version(new_data):
        print(f"✅ version.json atualizado: {previous_version} → {sw_version}")
        print(f"📅 Data: {new_data['updated']}")
        update_package_json_version(sw_version)
        return 0

    print("❌ Erro ao atualizar version.json")
    return 1


def show_current_state(current_data, current_version):
    """Exibe a versão atual e alerta sobre divergências"""
    print(f"Versão atual: {current_version}")
    print(f"Última atualização (version.json): {current_data.get('updated', 'N/A')}")

    sw_version_raw = load_sw_version()
    if sw_version_raw is None:
        print(f"⚠️  Não foi possível localizar a constante {VERSION_CONSTANT_NAME} em sw.js.")
        return

    print(f"Versão declarada em sw.js: {sw_version_raw}")
    try:
        sw_version_normalized = normalize_version(sw_version_raw)
    except ValueError:
        sw_version_normalized = sw_version_raw

    if sw_version_normalized != current_version:
        print("⚠️  Atenção: As versões estão divergentes. Execute 'python update-version.py --sync-from-sw' para alinhar.")


def determine_new_version(args, current_version):
    """Determina a nova versão com base nos parâmetros informados"""
    if args.version:
        try:
            return normalize_version(args.version)
        except ValueError:
            raise ValueError("Erro: Versão deve estar no formato major.minor.patch.build.revision (ex: 1.2.3.0.0) ou major.minor.patch (ex: 1.2.3)")

    new_version = increment_version(current_version, args.type)
    if new_version is None:
        raise ValueError("Não foi possível calcular a nova versão.")
    return new_version


def print_post_update_instructions():
    """Exibe instruções após atualizar a versão"""
    print("\n🚀 Para aplicar as mudanças:")
    print("1. Commit e push das alterações")
    print("   git add version.json package.json sw.js")
    print("   git commit -m \"Bump version\"")
    print("   git push")
    print("2. Os usuários serão notificados automaticamente da nova versão")
    print("3. O cache será atualizado automaticamente")

def main():
    parser = argparse.ArgumentParser(description='Atualiza a versão do site Terra Eletrônica')
    parser.add_argument('--type', '-t', choices=['major', 'minor', 'patch', 'build', 'revision'],
                       default='patch', help='Tipo de incremento da versão (padrão: patch)')
    parser.add_argument('--version', '-v', help='Define uma versão específica (ex: 2.1.0.0.0)')
    parser.add_argument('--show-current', '-s', action='store_true',
                       help='Mostra apenas a versão atual sem alterar')
    parser.add_argument('--sync-from-sw', action='store_true',
                        help='Sincroniza version.json e package.json com o número definido em sw.js')

    args = parser.parse_args()

    if args.sync_from_sw:
        sys.exit(sync_versions_from_sw())

    current_data = load_current_version()
    current_version_raw = current_data.get('version', '1.0.0.0.0')
    try:
        current_version = normalize_version(current_version_raw)
    except ValueError as exc:
        print(f"Erro: {exc}")
        sys.exit(1)

    if args.show_current:
        show_current_state(current_data, current_version)
        return

    try:
        new_version = determine_new_version(args, current_version)
    except ValueError as exc:
        print(exc)
        sys.exit(1)

    new_data = {
        "version": new_version,
        "updated": datetime.now().strftime("%Y-%m-%d"),
        "previous_version": current_version,
        "changelog": f"Atualização automática de {current_version} para {new_version}"
    }

    if save_version(new_data):
        print(f"✅ Versão atualizada: {current_version} → {new_version}")
        print(f"📅 Data: {new_data['updated']}")

        if write_sw_version(new_version):
            print(f"✅ sw.js atualizado para versão {new_version}")
        else:
            print(f"⚠️  Não foi possível atualizar sw.js automaticamente. Verifique a constante {VERSION_CONSTANT_NAME}.")

        update_package_json_version(new_version)
        print_post_update_instructions()
    else:
        print("❌ Erro ao atualizar versão")
        sys.exit(1)

if __name__ == "__main__":
    main()