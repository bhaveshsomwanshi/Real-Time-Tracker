//it send connection requist to backend
const socket = io();

//it preinstalled in window
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude});
    },(error)=>{
        console.error(error); 
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
);
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Sheryains Coding School",
}).addTo(map);

const markers = {};

//it gives us owr center point to where we are
socket.on("receive-location", (data)=> {
    const { id, latitude, longitude} = data;
    map.setView([latitude, longitude], 16);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

//it use to delete the anather user of the map
socket.on("user-disconnected",(id) => {
    if(markers[id]) {
        map.removeLayer(markers[id]);
        //it can delelte the whole object
        delete markers[id];
    }
});