let panorama;
let guess_marker;
let real_marker;
let line;
let guessed = false;
let dist;
let game_cnt = 0;
let score = 0;

function update_map(data, status){
    panorama.setPosition({lat: data.location.latLng.lat(), lng: data.location.latLng.lng()});
}

function initMap() {
    const map = new google.maps.Map(document.getElementById("map2"), {
        center: {lat: 0, lng: 0},
        zoom: 1,
        disableDefaultUI: true
    });

    map.addListener("click", (event) => {
        if (!guessed) {
            guess_marker.setPosition(event.latLng);
            guess_marker.setVisible(true);
            line.setPath([event.latLng, panorama.getPosition()]);
            dist = Math.round(get_distance(event.latLng, panorama.getPosition()));
        }
    });

    line = new google.maps.Polyline({
        visible: false,
        strokeOpacity: 1.0,
        strokeWeight: 2,
        geodesic: true,
        strokeColor: "red"
    })
    line.setMap(map)

    guess_marker = new google.maps.Marker({
        position: {lat: 0, lng: 0},
        visible: false,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        clickable: false,
        map
    });

    real_marker = new google.maps.Marker({
        position: {lat: 0, lng: 0},
        visible: false,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        clickable: false,
        map
    });

    panorama = new google.maps.StreetViewPanorama(document.getElementById("map"))
    panorama.setVisible(true);
    get_location();
    panorama.setOptions({clickToGo: true, showRoadLabels: false, addressControl: false})
}

function get_location(){
    let conf = document.getElementById("confirm");
    let dist_lbl = document.getElementById("dist");
    let score_lbl = document.getElementById("score_cnt");
    conf.onclick = function (){
        if(guess_marker.getPosition().lat() !== 0 || guess_marker.getPosition().lng() !== 0) {
            real_marker.setPosition(panorama.getPosition());
            real_marker.setVisible(true);
            line.setVisible(true);
            guessed = true;
            dist_lbl.textContent = dist;
            score += 100 - Math.round((dist / 20033) * 100)
            score_lbl.textContent = score;
            game_cnt += 1;
            if (game_cnt === 5) {
                conf.textContent = "Congratulations! You got " + score + " points! Play Again?";
            } else {
                conf.textContent = "Next";
            }
        } else{
            alert("CHOOSE A LOCATION")
        }
        conf.onclick = function (){
            get_location();
            conf.textContent = "Confirm";
            guess_marker.setPosition({lat: 0, lng: 0})
            line.setVisible(false);
            guess_marker.setVisible(false);
            real_marker.setVisible(false);
            guessed = false;
            dist_lbl.textContent = "0";
            if(game_cnt === 5){
                score_lbl.textContent = "0";
                score = 0;
                game_cnt = 0;
            }
        }
    }
    const svs = new google.maps.StreetViewService();
    svs.getPanorama({location: {lat: (Math.random()*180)-90, lng: (Math.random()*360)-180}, radius: 10000000, source: "outdoor"}, update_map);
}

function get_distance(latlng1, latlng2){
    const R = 6371e3; // metres
    const lat1 = latlng1.lat() * Math.PI/180; // φ, λ in radians
    const lat2 = latlng2.lat() * Math.PI/180;
    const lat_diff = (lat2-lat1) * Math.PI/180;
    const long_diff = (latlng2.lng()-latlng1.lng()) * Math.PI/180;

    const a = Math.sin(lat_diff/2) * Math.sin(lat_diff/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(long_diff/2) * Math.sin(long_diff/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return (R * c) / 1000; // in metres
}
