let latitude = null;
let longitude = null;

let marker = null;

const imageInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");
const previewText = document.getElementById("previewText");

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader();

        reader.addEventListener("load", function () {

            previewImage.setAttribute("src", this.result);
            previewImage.style.display = "block";   
            previewText.style.display = "none";

        });

        reader.readAsDataURL(file);

    }

});

const map = L.map("map").setView([26.2006, 92.9376], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

map.on("click", function (e) {

    latitude = e.latlng.lat;
    longitude = e.latlng.lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([latitude, longitude]).addTo(map);

    // zoom to selected location
    map.setView([latitude, longitude], 10);

});

// const locationBtn = document.getElementById("getLocation");
// const locationText = document.getElementById("locationText");
const form = document.getElementById("uploadForm");

async function uploadImage(locationId, file) {

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`/api/locations/${locationId}/images`, {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        throw new Error("Image upload failed");
    }

    return await res.json();
}
async function createLocation(data) {

    const res = await fetch("api/locations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Failed to create location");
    }

    return await res.json();
}


// locationBtn.addEventListener("click", () => {

//     console.log("hello")
//     if (!navigator.geolocation) {
//         alert("Geolocation not supported");
//         return;
//     }

//     locationText.innerText = "Capturing location...";

//     navigator.geolocation.getCurrentPosition((pos) => {

//         latitude = pos.coords.latitude;
//         longitude = pos.coords.longitude;

//         locationText.innerText =
//             `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

//     }, () => alert("Permission denied"));

// });


form.addEventListener("submit", async (e) => {

    console.log("hello1");
    e.preventDefault();
    console.log(latitude);
    if (latitude === null) {
        alert("Select location on the map");
        return;
    }


    const file = document.getElementById("image").files[0];

    const locationData = {

        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        state: document.getElementById("state").value,
        district: document.getElementById("district").value,
        category: document.getElementById("category").value,
        latitude,
        longitude

    };

    try {

        const location = await createLocation(locationData);
        if (file) {
            await uploadImage(location._id, file);
        }

        alert("Location uploaded successfully!");

        form.reset();
        // locationText.innerText = "";


        // reset image preview
        previewImage.src = "";
        previewImage.style.display = "none";
        previewText.style.display = "block";

        // reset map marker
        if (marker) {
            map.removeLayer(marker);
            marker = null;
        }

        // reset coordinates
        latitude = null;
        longitude = null;

        map.setView([26.2006, 92.9376], 7);

    } catch (err) {

        console.error(err);
        alert("Upload failed");

    }

});

