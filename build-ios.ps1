# Script para generar archivo IPA para iPhone - Molaris App
# Ejecutar este script en PowerShell como administrador

Write-Host "=== Generador de archivo IPA para iPhone ===" -ForegroundColor Green
Write-Host "Molaris App" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Verificar si npm está instalado
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm no está instalado." -ForegroundColor Red
    exit 1
}

# Instalar EAS CLI si no está instalado
Write-Host "Verificando EAS CLI..." -ForegroundColor Yellow
try {
    $easVersion = eas --version
    Write-Host "EAS CLI encontrado: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "Instalando EAS CLI..." -ForegroundColor Yellow
    npm install -g @expo/eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se pudo instalar EAS CLI. Intenta ejecutar: npm install -g @expo/eas-cli" -ForegroundColor Red
        exit 1
    }
}

# Verificar si el usuario está logueado en Expo
Write-Host "Verificando sesión de Expo..." -ForegroundColor Yellow
try {
    $user = eas whoami
    Write-Host "Sesión activa: $user" -ForegroundColor Green
} catch {
    Write-Host "No hay sesión activa. Iniciando sesión..." -ForegroundColor Yellow
    Write-Host "Por favor, ingresa tus credenciales de Expo:" -ForegroundColor Cyan
    eas login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se pudo iniciar sesión. Verifica tus credenciales." -ForegroundColor Red
        exit 1
    }
}

# Instalar dependencias del proyecto
Write-Host "Instalando dependencias del proyecto..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudieron instalar las dependencias." -ForegroundColor Red
    exit 1
}

# Configurar el proyecto para EAS Build
Write-Host "Configurando proyecto para EAS Build..." -ForegroundColor Yellow
eas build:configure
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo configurar el proyecto." -ForegroundColor Red
    exit 1
}

# Preguntar qué tipo de build quiere el usuario
Write-Host ""
Write-Host "¿Qué tipo de build quieres generar?" -ForegroundColor Cyan
Write-Host "1. Build para dispositivo físico (recomendado para iPhone)" -ForegroundColor White
Write-Host "2. Build para simulador" -ForegroundColor White
Write-Host "3. Build de desarrollo" -ForegroundColor White

$choice = Read-Host "Selecciona una opción (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Generando build para dispositivo físico..." -ForegroundColor Green
        npm run build:ios
    }
    "2" {
        Write-Host "Generando build para simulador..." -ForegroundColor Green
        npm run build:ios-simulator
    }
    "3" {
        Write-Host "Generando build de desarrollo..." -ForegroundColor Green
        eas build --platform ios --profile development
    }
    default {
        Write-Host "Opción inválida. Generando build para dispositivo físico..." -ForegroundColor Yellow
        npm run build:ios
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: El build falló. Revisa los logs arriba." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Build completado exitosamente ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para descargar el archivo IPA:" -ForegroundColor Cyan
Write-Host "1. Ve a https://expo.dev" -ForegroundColor White
Write-Host "2. Inicia sesión con tu cuenta" -ForegroundColor White
Write-Host "3. Ve a tu proyecto 'Molaris App'" -ForegroundColor White
Write-Host "4. En la sección 'Builds', encuentra tu build más reciente" -ForegroundColor White
Write-Host "5. Haz clic en 'Download' para descargar el archivo .ipa" -ForegroundColor White
Write-Host ""
Write-Host "Para instalar en tu iPhone:" -ForegroundColor Cyan
Write-Host "- Conecta tu iPhone a tu computadora" -ForegroundColor White
Write-Host "- Abre iTunes o Finder" -ForegroundColor White
Write-Host "- Arrastra el archivo .ipa descargado" -ForegroundColor White
Write-Host "- Sincroniza tu dispositivo" -ForegroundColor White
Write-Host ""
Write-Host "¡Listo! Tu archivo IPA está listo para descargar." -ForegroundColor Green
