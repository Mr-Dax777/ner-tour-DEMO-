const map = L.map('map').setView([26.2, 91.7], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);


async function loadMarkers() {
    try {
        const gems = await getAllGems();

        gems.forEach(gem => {

            if (!gem.latitude) return;

            const marker = L.marker([gem.latitude, gem.longitude]).addTo(map);

            marker.bindPopup(`
                <b>${gem.title}</b><br>
                <button onclick="openDetail('${gem._id}')">View</button>
            `);
        });

    } catch {
        console.log("Failed to load markers");
    }
}

function openDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

loadMarkers();