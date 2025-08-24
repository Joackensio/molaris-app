# Script para generar archivo IPA para cliente - Molaris App
# Este script genera un archivo IPA que puedes distribuir a tu cliente

Write-Host "=== Generador de archivo IPA para cliente ===" -ForegroundColor Green
Write-Host "Molaris App - Archivo distribuible" -ForegroundColor Cyan
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
Write-Host "=== IMPORTANTE - INFORMACIÓN PARA EL CLIENTE ===" -ForegroundColor Yellow
Write-Host "Este archivo IPA se puede instalar en dispositivos iOS, pero:" -ForegroundColor White
Write-Host "1. El cliente necesitará confiar en el certificado de desarrollador" -ForegroundColor White
Write-Host "2. La app puede mostrar una advertencia de seguridad al instalar" -ForegroundColor White
Write-Host "3. Es perfecto para distribución interna y pruebas" -ForegroundColor White
Write-Host ""

$continue = Read-Host "¿Quieres continuar generando el archivo IPA? (s/n)"
if ($continue -ne "s" -and $continue -ne "S") {
    Write-Host "Build cancelado." -ForegroundColor Yellow
    exit 0
}

# Generar build para distribución
Write-Host "Generando archivo IPA para distribución..." -ForegroundColor Green
npm run build:ios-distribution

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: El build falló. Revisa los logs arriba." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== ¡ARCHIVO IPA GENERADO EXITOSAMENTE! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para descargar el archivo IPA:" -ForegroundColor Cyan
Write-Host "1. Ve a https://expo.dev" -ForegroundColor White
Write-Host "2. Inicia sesión con tu cuenta" -ForegroundColor White
Write-Host "3. Ve a tu proyecto 'Molaris App'" -ForegroundColor White
Write-Host "4. En la sección 'Builds', encuentra tu build más reciente" -ForegroundColor White
Write-Host "5. Haz clic en 'Download' para descargar el archivo .ipa" -ForegroundColor White
Write-Host ""
Write-Host "=== INSTRUCCIONES PARA TU CLIENTE ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para instalar en el iPhone del cliente:" -ForegroundColor Cyan
Write-Host "1. Conecta el iPhone a una computadora" -ForegroundColor White
Write-Host "2. Abre iTunes (Windows) o Finder (Mac)" -ForegroundColor White
Write-Host "3. Arrastra el archivo .ipa descargado" -ForegroundColor White
Write-Host "4. Sincroniza el dispositivo" -ForegroundColor White
Write-Host "5. La app aparecerá en el iPhone" -ForegroundColor White
Write-Host ""
Write-Host "Si aparece una advertencia de seguridad:" -ForegroundColor Yellow
Write-Host "1. Ve a Configuración > General > Gestión de dispositivos" -ForegroundColor White
Write-Host "2. Busca el certificado de desarrollador" -ForegroundColor White
Write-Host "3. Toca 'Confiar' en el certificado" -ForegroundColor White
Write-Host ""
Write-Host "¡El archivo IPA está listo para entregar a tu cliente!" -ForegroundColor Green
