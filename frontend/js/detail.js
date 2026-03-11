const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function getGemById(id){
    const res = await fetch(`http://localhost:5501/api/locations/${id}`);

    if(!res.ok){
    }
    return await res.json();
}
async function loadDetail() {

    if (!id) return;

    let gem = await getGemById(id);
    console.log(gem.data)
    gem = gem.data;
    document.getElementById("title").innerText = gem.name;
    document.getElementById("description").innerText = gem.description;
    document.getElementById("category").innerText = gem.category;
    document.getElementById("rating").innerText = gem.rating || 0;

    /* IMAGE GALLERY */

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = " ";

    if (gem.images && gem.images.length > 0) {

        gem.images.forEach(img => {

            const image = document.createElement("img");

            image.src = "uploads/"+img;

            image.onclick = () => {

                document.getElementById("modalImg").src = img;

                document.getElementById("imageModal").style.display = "flex";

            };

            gallery.appendChild(image);

        });

    }

    // console.log(gem.lon);
    // const miniMap = L.map('miniMap').setView([gem.latitude, gem.longitude], 12);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    //     .addTo(miniMap);

    // L.marker([gem.latitude, gem.longitude]).addTo(miniMap);

    // loadComments(id);

    // loadNearbyPlaces(gem);

    // document.getElementById("imageModal").onclick = () => {
    //     document.getElementById("imageModal").style.display = "none";
    // };


    // document.getElementById("closeModal").onclick = () => {
    //     document.getElementById("imageModal").style.display = "none";
    // };
}


loadDetail();




async function loadComments(id) {

    const res = await fetch(`${API_BASE}/gems/${id}/comments`);
    const comments = await res.json();

    const container = document.getElementById("comments");
    container.innerHTML = "";

    comments.forEach(c => {

        const div = document.createElement("div");
        div.className = "comment";

        div.innerHTML = `
            <b>${c.user}</b> ⭐${c.rating}
            <p>${c.text}</p>
        `;

        container.appendChild(div);

    });

}


async function submitComment() {

    const text = document.getElementById("commentText").value;
    const rating = document.getElementById("rating").value;

    await fetch(`${API_BASE}/gems/${id}/comments`, {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            user: "Anonymous",
            text: text,
            rating: rating
        })

    });

    loadComments(id);

}



async function loadNearbyPlaces(currentGem){

    const gems = await getAllGems();

    const container = document.getElementById("nearbyPlaces");
    container.innerHTML = "";

    if(!gems || gems.length <= 1){
        container.innerHTML = "<p>No nearby places found.</p>";
        return;
    }

    const nearby = gems
        .filter(g => String(g._id) !== String(currentGem._id))
        .filter(g => g.latitude && g.longitude)
        .map(g => ({
            ...g,
            distance: getDistance(
                currentGem.latitude,
                currentGem.longitude,
                g.latitude,
                g.longitude
            )
        }))
        .sort((a,b) => a.distance - b.distance)
        .slice(0,4);

    if(nearby.length === 0){
        container.innerHTML = "<p>No nearby places found.</p>";
        return;
    }

    nearby.forEach(place => {

        const card = document.createElement("div");
        card.className = "nearby-card";

        card.innerHTML = `
            <div class="nearby-item">

                <img src="${place.images?.[0] || 'assets/images/placeholder.jpg'}">

                <div class="nearby-info">
                    <b>${place.name}</b>
                    <p>${place.category}</p>
                </div>

            </div>
        `;

        card.onclick = () => {
            window.location.href = `detail.html?id=${place._id}`;
        };

        container.appendChild(card);

    });
}


function getDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}  


async function loadNearbyPlaces() {

    const res = await fetch("/api/locations");  
    let places = await res.json();

    places = places.data;
    console.log(places)
    const container = document.getElementById("nearbyPlaces");
    container.innerHTML = "";

    places.forEach(place => {

        const div = document.createElement("div");
        div.className = "nearby-item";

        div.innerHTML = `
            <h4>${place.name}</h4>
            <p>${place.category}</p>
        `;

        container.appendChild(div);
    });

}

loadNearbyPlaces();