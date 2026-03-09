const API_BASE = "http://localhost:5000/api/locations";


async function createLocation(data){

    const res = await fetch(API_BASE, {
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json();
}


async function uploadImage(locationId, file){

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE}/${locationId}/images`, {
        method:"POST",
        body: formData
    });

    return res.json();
}


async function getAllGems(){

    const res = await fetch(API_BASE);
    const data = await res.json();
    return data.data;
}


async function getGemById(id){

    const res = await fetch(`${API_BASE}/${id}`);
    const data = await res.json();
    return data.data;
}