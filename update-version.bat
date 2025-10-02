@echo off
REM Script para atualizar versão do site Terra Eletrônica
REM Uso: update-version.bat [patch|minor|major|build|revision] ou update-version.bat --version x.y.z.w.v

setlocal EnableDelayedExpansion

echo.
echo ====================================
echo   ATUALIZADOR DE VERSAO - Terra Eletronica
echo ====================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado. Instale o Python para usar este script.
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Obter diretório do script
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Verificar argumentos
if "%1"=="" (
    echo Usando incremento padrao: patch
    python update-version.py --type patch
) else if /I "%1"=="--help" (
    echo.
    echo Uso:
    echo   update-version.bat [patch^|minor^|major^|build^|revision]
    echo   update-version.bat --version x.y.z.w.v
    echo   update-version.bat --show-current
    echo   update-version.bat sync
    echo.
    echo Exemplos:
    echo   update-version.bat patch          ^(incrementa 1.0.0.0.0 -^> 1.0.1.0.0^)
    echo   update-version.bat minor          ^(incrementa 1.0.0.0.0 -^> 1.1.0.0.0^)
    echo   update-version.bat major          ^(incrementa 1.0.0.0.0 -^> 2.0.0.0.0^)
    echo   update-version.bat build          ^(incrementa 1.0.0.0.0 -^> 1.0.0.1.0^)
    echo   update-version.bat revision       ^(incrementa 1.0.0.0.0 -^> 1.0.0.0.1^)
    echo   update-version.bat --version 2.5.1.0.0
    echo   update-version.bat --show-current
    echo   update-version.bat sync            ^(sincroniza version.json/package.json com sw.js^)
    echo.
) else if /I "%1"=="--show-current" (
    python update-version.py --show-current
) else if /I "%1"=="sync" (
    python update-version.py --sync-from-sw
) else if /I "%1"=="--sync-from-sw" (
    python update-version.py --sync-from-sw
) else if /I "%1"=="--version" (
    if "%2"=="" (
        echo ERRO: Especifique a versao apos --version
        echo Exemplo: update-version.bat --version 1.2.3.0.0
        pause
        exit /b 1
    )
    python update-version.py --version %2
) else (
    python update-version.py --type %1
)

REM Verificar se o comando foi executado com sucesso
if errorlevel 1 (
    echo.
    echo ERRO: Falha ao atualizar versao. Verifique os parametros.
    pause
    exit /b 1
)

echo.
echo ====================================
echo PROXIMOS PASSOS:
echo ====================================
echo 1. Commit e push das alteracoes:
echo    git add version.json package.json sw.js
echo    git commit -m "Bump version"
echo    git push
echo.
echo 2. Os usuarios serao notificados automaticamente
echo 3. O cache sera atualizado automaticamente
echo ====================================
echo.

REM Perguntar se quer fazer commit automaticamente
set /p "AUTO_COMMIT=Deseja fazer commit automatico? (s/N): "
if /i "!AUTO_COMMIT!"=="s" (
    echo.
    echo Fazendo commit automatico...
    git add version.json package.json sw.js 2>nul
    git add . 2>nul
    for /f "tokens=*" %%a in ('python update-version.py --show-current ^| findstr "Versao atual:"') do set VERSION_LINE=%%a
    for /f "tokens=3" %%b in ("!VERSION_LINE!") do set CURRENT_VERSION=%%b
    git commit -m "Bump version to !CURRENT_VERSION!" 2>nul
    if errorlevel 1 (
        echo Aviso: Nenhuma alteracao para commit ou erro no git
    ) else (
        echo Commit realizado com sucesso!
        set /p "AUTO_PUSH=Deseja fazer push automatico? (s/N): "
        if /i "!AUTO_PUSH!"=="s" (
            git push
            if errorlevel 1 (
                echo Erro ao fazer push. Faca manualmente.
            ) else (
                echo Push realizado com sucesso!
            )
        )
    )
)

echo.
pause