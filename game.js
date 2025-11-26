// game.js

const GAME_DURATION = 90;
const SCORE_CORRECT = 10;
const SCORE_WRONG = 5;

const DIRECTION_ANGLES = {
    'N': 0,   'NE': 45,  'E': 90,  'SE': 135,
    'S': 180, 'SW': 225, 'W': 270, 'NW': 315
};

// KALKIŞ HAVALİMANI VERİLERİ
const airports = [
    { code: "KORD", name: "Chicago", coords: [41.974, -87.907], zoom: 11, directions: ['E', 'W', 'NE', 'SW', 'NW', 'SE'] },
    { code: "EHAM", name: "Amsterdam", coords: [52.308, 4.768], zoom: 11, directions: ['N', 'S', 'E', 'W', 'SW', 'NE'] },
    { code: "EGLL", name: "Londra", coords: [51.470, -0.454], zoom: 12, directions: ['E', 'W'] },
    { code: "EDDF", name: "Frankfurt", coords: [50.037, 8.547], zoom: 12, directions: ['E', 'W', 'N', 'S', 'NE', 'SW'] },
    { code: "LTFM", name: "İstanbul", coords: [41.275, 28.742], zoom: 11, directions: ['N', 'S'] },
    { code: "LTAI", name: "Antalya", coords: [36.908, 30.794], zoom: 12, directions: ['N', 'S'] },
    { code: "WSSS", name: "Singapur", coords: [1.364, 103.981], zoom: 12, directions: ['NE', 'SW'] },
    { code: "OMDB", name: "Dubai", coords: [25.253, 55.365], zoom: 12, directions: ['NW', 'SE'] }
];

// HEDEF LİSTESİ
const targets = [
    // Asya
    { name: "Tokyo", coords: [35.689, 139.691] },
    { name: "Pekin", coords: [39.904, 116.407] },
    { name: "Bangkok", coords: [13.756, 100.501] },
    { name: "Seoul", coords: [37.566, 126.978] },
    { name: "Jakarta", coords: [-6.208, 106.845] },
    // Avrupa
    { name: "London", coords: [51.507, -0.127] },
    { name: "Paris", coords: [48.856, 2.352] },
    { name: "Berlin", coords: [52.520, 13.405] },
    { name: "Madrid", coords: [40.416, -3.703] },
    { name: "Roma", coords: [41.902, 12.496] },
    { name: "Moskova", coords: [55.755, 37.617] },
    { name: "Istanbul", coords: [41.008, 28.978] },
    // Kuzey Amerika
    { name: "New York", coords: [40.712, -74.006] },
    { name: "Los Angeles", coords: [34.052, -118.243] },
    { name: "Chicago", coords: [41.878, -87.629] },
    { name: "Toronto", coords: [43.653, -79.383] },
    { name: "Mexico City", coords: [19.432, -99.133] },
    // Güney Amerika
    { name: "Rio de Janeiro", coords: [-22.906, -43.172] },
    { name: "São Paulo", coords: [-23.550, -46.633] },
    { name: "Buenos Aires", coords: [-34.603, -58.381] },
    // Afrika
    { name: "Kahire", coords: [30.044, 31.235] },
    { name: "Cape Town", coords: [-33.924, 18.424] },
    { name: "Lagos", coords: [6.524, 3.379] },
    { name: "Nairobi", coords: [-1.292, 36.821] },
    { name: "Kazablanka", coords: [33.573, -7.589] },
    // Okyanusya
    { name: "Sydney", coords: [-33.868, 151.209] },
    { name: "Melbourne", coords: [-37.813, 144.963] },
    // Orta Doğu
    { name: "Dubai", coords: [25.276, 55.296] },
    { name: "Riyad", coords: [24.713, 46.675] },
    { name: "Tahran", coords: [35.689, 51.389] }
];

let map = L.map('map', { zoomControl: false, attributionControl: false }).setView([0, 0], 2);
L.control.zoom({ position: 'topright' }).addTo(map);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

let currentDeparture = null;
let currentTarget = null;
let correctBearing = null;
let score = 0;
let arrowMarkers = [];
let gameActive = false;
let timeLeft = GAME_DURATION;
let timerInterval = null;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getAngleDifference(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2);
    return Math.min(diff, 360 - diff);
}

function calculateCorrectBearing(startCoords, endCoords) {
    const startPoint = turf.point([startCoords[1], startCoords[0]]);
    const endPoint = turf.point([endCoords[1], endCoords[0]]);
    let bearing = turf.bearing(startPoint, endPoint);
    if (bearing < 0) bearing += 360;
    return bearing;
}

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = GAME_DURATION;

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    
    map.invalidateSize();

    document.getElementById('score').innerText = score;
    document.getElementById('time').innerText = timeLeft;
    document.getElementById('time').classList.remove('urgent');

    startNewRound();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        const timeDisplay = document.getElementById('time');
        timeDisplay.innerText = timeLeft;
        if (timeLeft <= 10) timeDisplay.classList.add('urgent');
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'flex';
    document.getElementById('final-score').innerText = score;
}

// --- Puanlama Mantığı: En İyi Seçeneği Kontrol Et ---
function checkAnswer(selectedDirCode) {
    if (!gameActive) return;
    
    // 1. Seçilen yönün açısını ve hedefe olan farkını bul
    const selectedHeading = DIRECTION_ANGLES[selectedDirCode];
    const selectedDifference = getAngleDifference(selectedHeading, correctBearing);

    // 2. Bu havalimanındaki MEVCUT tüm seçenekler arasında en küçük farkı bul
    let minDifference = 360;
    currentDeparture.directions.forEach(dirCode => {
        const heading = DIRECTION_ANGLES[dirCode];
        const diff = getAngleDifference(heading, correctBearing);
        if (diff < minDifference) {
            minDifference = diff;
        }
    });

    // 3. Karşılaştırma: Eğer seçilen fark, mümkün olan en küçük farka eşitse (veya çok yakınsa) doğrudur.
    // 0.1 gibi çok küçük bir tolerans, kayan nokta hesaplama hatalarını önler.
    if (selectedDifference <= minDifference + 0.1) {
        // DOĞRU: Mevcutların en iyisi seçildi
        score += SCORE_CORRECT;
        setTimeout(startNewRound, 300);
    } else {
        // YANLIŞ: Daha iyi bir seçenek vardı
        score -= SCORE_WRONG;
        setTimeout(startNewRound, 300);
    }
    document.getElementById('score').innerText = score;
}

function startNewRound() {
    if (!gameActive) return;

    arrowMarkers.forEach(marker => map.removeLayer(marker));
    arrowMarkers = [];

    currentDeparture = airports[getRandomInt(airports.length)];
    do {
        currentTarget = targets[getRandomInt(targets.length)];
    } while (
        currentDeparture.coords[0] === currentTarget.coords[0] &&
        currentDeparture.coords[1] === currentTarget.coords[1]
    );

    document.getElementById('departure-display').innerText = `KALKIŞ: ${currentDeparture.name}`;
    document.getElementById('target-display').innerText = `HEDEF: ${currentTarget.name}`;
    
    map.flyTo(currentDeparture.coords, currentDeparture.zoom, { animate: true, duration: 1.5 });
    
    correctBearing = calculateCorrectBearing(currentDeparture.coords, currentTarget.coords);

    const centerPoint = turf.point([currentDeparture.coords[1], currentDeparture.coords[0]]);
    const offsetDistance = currentDeparture.zoom > 11 ? 2.5 : 5;

    currentDeparture.directions.forEach(dirCode => {
        const heading = DIRECTION_ANGLES[dirCode];
        const destination = turf.destination(centerPoint, offsetDistance, heading, {units: 'kilometers'});
        const iconCoords = [destination.geometry.coordinates[1], destination.geometry.coordinates[0]];

        const arrowIcon = L.divIcon({
            className: 'direction-arrow-icon',
            html: `<div class="compass-btn">${dirCode}</div>`,
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        });

        const marker = L.marker(iconCoords, { icon: arrowIcon, interactive: true }).addTo(map);
        marker.on('click', () => checkAnswer(dirCode));
        arrowMarkers.push(marker);
    });
}

window.onload = function() {
    if (typeof turf === 'undefined') {
        alert("Hata: Turf.js kütüphanesi yüklenemedi.");
        return;
    }
    const startBtn = document.getElementById('start-button');
    if(startBtn) startBtn.addEventListener('click', startGame);
};