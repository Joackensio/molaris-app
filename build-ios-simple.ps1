# Script para generar archivo IPA para iPhone - Molaris App (Sin Apple ID)
# Ejecutar este script en PowerShell como administrador

Write-Host "=== Generador de archivo IPA para iPhone (Sin Apple ID) ===" -ForegroundColor Green
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

Write-Host ""
Write-Host "=== IMPORTANTE ===" -ForegroundColor Yellow
Write-Host "Este build se generará sin Apple ID, lo que significa:" -ForegroundColor White
Write-Host "1. Solo podrás instalar la app en tu dispositivo usando Expo Go" -ForegroundColor White
Write-Host "2. No podrás distribuir la app a otros usuarios" -ForegroundColor White
Write-Host "3. Es perfecto para pruebas y desarrollo" -ForegroundColor White
Write-Host ""

$continue = Read-Host "¿Quieres continuar? (s/n)"
if ($continue -ne "s" -and $continue -ne "S") {
    Write-Host "Build cancelado." -ForegroundColor Yellow
    exit 0
}

# Generar build simple sin Apple ID
Write-Host "Generando build simple (sin Apple ID)..." -ForegroundColor Green
npm run build:ios-simple

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: El build falló. Revisa los logs arriba." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Build completado exitosamente ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para usar la aplicación en tu iPhone:" -ForegroundColor Cyan
Write-Host "1. Descarga la app 'Expo Go' desde la App Store" -ForegroundColor White
Write-Host "2. Ejecuta: npm run dev" -ForegroundColor White
Write-Host "3. Escanea el código QR que aparece con la app Expo Go" -ForegroundColor White
Write-Host "4. ¡Listo! Tu app se abrirá en Expo Go" -ForegroundColor White
Write-Host ""
Write-Host "Alternativa: Para generar un archivo IPA completo necesitarás:" -ForegroundColor Yellow
Write-Host "1. Una cuenta de Apple Developer ($99/año)" -ForegroundColor White
Write-Host "2. Configurar certificados de desarrollo" -ForegroundColor White
Write-Host "3. Usar el script original: .\build-ios.ps1" -ForegroundColor White
Write-Host ""
Write-Host "¡Tu aplicación está lista para usar en Expo Go!" -ForegroundColor Green
