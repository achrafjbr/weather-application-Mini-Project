// endpoint
const baseUrl = 'http://localhost:3000/places';

const fromJson = (data) => {
    return JSON.parse(data);
}

const toJson = (data) => {
    JSON.stringify(data);
}


// Get place by id
export const getPlaceByMatricule = (matricule) => {
    let palce = "";
    if (!matricule) return;
    fetch(baseUrl + `places?${matricule}`, { method: "GET", })
        .then(response => {
            if (response.status == 200 || response.ok) {
                return response.json();
            } else {
                return Promise.reject("Something went wrong!")
            }
        })
        .then(data => {
            palce = fromJson(data);
        }).catch(error => {
            console.log(error);
        });
    return palce;
};

// Get place by id
export const getReservationByMatricule = async (matricule) => {
    if (!matricule) return;

    try {
        const response = await fetch("http://localhost:3000/reservation?plateNumber=" + matricule, 
        { method: "GET" });

        if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
        }

        const data = await response.json();
        return data; // This returns the actual data
    } catch (error) {
        console.log("Fetch error:", error);
        throw error; // Re-throw if you want caller to handle it
    }
};

// Get all places
export const getAllPlaces = () => {
    return fetch('http://localhost:3000/places', { method: "GET", })
        .then(response => {
            if (response.status == 200 || response.ok) {
                return response.json();
            } else {
                return Promise.reject("Something went wrong!")
            }
        }).then(data => data)
        .catch(error => {
            console.log(error);
        });
}


export const reservePlace = async (slotNumber, plateNumber, available) => {
    console.log("data:::", slotNumber, plateNumber, available);

    const res = await fetch(`http://localhost:3000/places?slotNumber=${slotNumber}`);
    const places = await res.json();
    console.log("Places :", places[0]);


    const placeId = places[0].id;
    console.log("Places ID:", placeId);


    return fetch(`http://localhost:3000/places/${placeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            plateNumber,
            available
        })
    });
};


export const addVehicule = async (reservation) => {
    try {
        let response = await fetch("http://localhost:3000/reservation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservation),
        });
        if (!response.ok) {
            throw new Error("Some thing went wrong !" + response.status);
        } else {
            return await response.json();
        }
    } catch (error) {
        throw error;

    }
}

export const exitVehiculeFromParking = async (newData) => {
    if (!plateNumber) return;
    try {
        const response = await fetch("http://localhost:3000/places?plateNumber=" + Number(newData.plateNumber),
            { method: 'PUT', headers: { "Content-Type": "application/json" }, body: JSON.stringify(newData) })
        if (!response.ok) {
            throw new Error({ errorMessage: "Some thing went wrong" + response.status });
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        throw error;
    }
}

export const updateReservationExitTime = async (updateVehicule) => {
    if (!plateNumber) return;
    try {
        const response = await fetch("http://localhost:3000/reservation?plateNumber=" + Number(plateNumber),
            { method: 'PUT', headers: { "Content-Type": "application/json" }, body: JSON.stringify(updateVehicule) })
        if (!response.ok) {
            throw new Error({ errorMessage: "Some thing went wrong" + response.status })
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        throw error;
    }
}

export const calculateDuration = (entryTime) => {
    const currentTime = new Date();

    // Parse '14:30' into a Date object (using today's date)
    const [hours, minutes] = entryTime.split(':').map(Number);
    const existingTime = new Date();
    existingTime.setHours(hours, minutes, 0, 0);

    const diffMs = Math.abs(currentTime - existingTime);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes;
}   