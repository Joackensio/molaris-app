# Script alternativo para generar archivo instalable sin Apple ID
# Este script usa métodos alternativos para crear un archivo que el cliente pueda instalar

Write-Host "=== Generador Alternativo sin Apple ID ===" -ForegroundColor Green
Write-Host "Molaris App - Método Alternativo" -ForegroundColor Cyan
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
Write-Host "=== OPCIONES DISPONIBLES ===" -ForegroundColor Yellow
Write-Host "1. Generar build para simulador (más fácil, sin Apple ID)" -ForegroundColor White
Write-Host "2. Intentar build sin Apple ID (puede fallar)" -ForegroundColor White
Write-Host "3. Usar método alternativo con herramientas externas" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Selecciona una opción (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Generando build para simulador..." -ForegroundColor Green
        npm run build:ios-simulator
        
        Write-Host ""
        Write-Host "=== INSTRUCCIONES PARA EL CLIENTE ===" -ForegroundColor Yellow
        Write-Host "Para usar la aplicación:" -ForegroundColor Cyan
        Write-Host "1. El cliente necesitará instalar Xcode en su Mac" -ForegroundColor White
        Write-Host "2. Descargar el archivo .app desde expo.dev" -ForegroundColor White
        Write-Host "3. Arrastrar el archivo .app al simulador de iOS" -ForegroundColor White
        Write-Host "4. La app funcionará en el simulador" -ForegroundColor White
    }
    "2" {
        Write-Host "Intentando build sin Apple ID..." -ForegroundColor Green
        npm run build:ios-no-apple
        
        Write-Host ""
        Write-Host "=== RESULTADO ===" -ForegroundColor Yellow
        Write-Host "Si el build fue exitoso, descarga el archivo desde expo.dev" -ForegroundColor White
        Write-Host "Si falló, usa la opción 1 o 3" -ForegroundColor White
    }
    "3" {
        Write-Host "=== MÉTODO ALTERNATIVO ===" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para crear un archivo instalable sin Apple ID:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Genera un build para simulador:" -ForegroundColor White
        Write-Host "   npm run build:ios-simulator" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Descarga el archivo .app desde expo.dev" -ForegroundColor White
        Write-Host ""
        Write-Host "3. Usa una herramienta como 'ios-deploy' para convertir:" -ForegroundColor White
        Write-Host "   npm install -g ios-deploy" -ForegroundColor Gray
        Write-Host "   ios-deploy --bundle /path/to/your/app.app" -ForegroundColor Gray
        Write-Host ""
        Write-Host "4. O usa 'AltStore' para distribución:" -ForegroundColor White
        Write-Host "   - Instala AltStore en el iPhone del cliente" -ForegroundColor Gray
        Write-Host "   - Convierte el .app a .ipa usando herramientas online" -ForegroundColor Gray
        Write-Host "   - Instala usando AltStore" -ForegroundColor Gray
    }
    default {
        Write-Host "Opción inválida. Usando opción 1 (simulador)..." -ForegroundColor Yellow
        npm run build:ios-simulator
    }
}

Write-Host ""
Write-Host "=== RECOMENDACIÓN FINAL ===" -ForegroundColor Yellow
Write-Host "Para distribución profesional sin Apple ID:" -ForegroundColor White
Write-Host "1. Considera usar TestFlight (requiere Apple Developer)" -ForegroundColor White
Write-Host "2. Usa AltStore para distribución interna" -ForegroundColor White
Write-Host "3. Publica en la App Store (requiere Apple Developer)" -ForegroundColor White
Write-Host ""
Write-Host "Para desarrollo y pruebas:" -ForegroundColor White
Write-Host "- Usa Expo Go (más fácil y gratuito)" -ForegroundColor White
