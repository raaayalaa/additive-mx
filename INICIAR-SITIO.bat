@echo off
setlocal
cd /d "%~dp0"
title ADDITIVE - servidor local (http://localhost:8080)

echo ==========================================================
echo   ADDITIVE - vista previa local
echo   URL:  http://localhost:8080/
echo.
echo   Manten esta ventana abierta mientras navegas.
echo   Para detener el servidor: cierra esta ventana o Ctrl+C.
echo ==========================================================
echo.

set "SRV="
where python >nul 2>nul && set "SRV=python -m http.server 8080 --bind 127.0.0.1"
if not defined SRV ( where py >nul 2>nul && set "SRV=py -m http.server 8080 --bind 127.0.0.1" )
if not defined SRV ( where npx >nul 2>nul && set "SRV=npx --yes http-server -p 8080 -c-1" )

if not defined SRV (
  echo No se encontro Python ni Node.js en este equipo.
  echo.
  echo Puedes abrir el archivo "index.html" directamente con doble clic,
  echo aunque en ese caso la tipografia Montserrat no se cargara y se
  echo usara una fuente alternativa del sistema.
  echo.
  pause
  exit /b 1
)

start "" /b cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:8080/"
%SRV%

endlocal
