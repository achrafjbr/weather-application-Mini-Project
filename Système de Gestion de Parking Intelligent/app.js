import { updateReservationExitTime, exitVehiculeFromParking, getAllPlaces, getReservationByMatricule, calculateDuration, addVehicule, reservePlace } from './helper.js';
//Book your parking Section.
const vehicules = document.querySelector('.vehicules');
const bookingDateTime = document.querySelector('.booking #book-date');

const bookingMatriculation = document.querySelector('.booking #matricule');
const bookingButton = document.querySelector('.booking .booking-button');

let trackSelectedVehicule = 'bike';
let bookDateTime;
let bookMatruculation;
let trackSelectedSlotNumber = "A1"; // this will points on the last available zone.

let selectedVehicule = {}

// Select vehicule
vehicules.addEventListener("click", event => {
    let vehicule = event.target.closest(".vehicule");
    if (!vehicule.classList.contains('isActive')) {

        document.querySelector('.vehicule.isActive')
            .classList
            .remove("isActive");

        vehicule.classList.add('isActive');
        trackSelectedVehicule = vehicule.classList[1];
        console.log(trackSelectedVehicule)
    }
});

// Reservation time.
bookingDateTime.addEventListener("change", event => {
    const element = event.target;
    bookDateTime = element.value;
    console.log(bookDateTime);
});

// Reservation matricule.
bookingMatriculation.addEventListener("change", event => {
    const element = event.target;
    bookMatruculation = element.value;
    console.log(bookMatruculation);
});

// Validate and check for error.
const bookingParkingPlace = (event) => {
    console.log('Adding vehicule');
    event.preventDefault();
    let isError = validationError()
    if (isError == false) {
        // add data to json serveur;
        const vehicule = {
            plateNumber: bookMatruculation,
            type: trackSelectedVehicule,
            entryTime: bookDateTime,
            exitTime: "",
            slotNumber: trackSelectedSlotNumber,
        }
        console.log("Add Vehicule:", vehicule);
        // Add vehicule data to DB.
        addVehicule(vehicule)
            .then(() => {
                return reservePlace(trackSelectedSlotNumber, bookMatruculation, false);
            })
            .then(() => {
                alert("Parking reserved successfully 🚗");
            })
            .catch(err => console.error(err));
    } else {
        // show error in the screen
        const error = document.querySelector(".error-validation");
        error.classList.add("showError");
        error.innerHTML = isError;
        let clearTimer = setTimeout(() => {
            error.classList.remove("showError");
        }, 1000);
        //clearTimeout(clearTimer);
    }

}


//  Saving reservation data to DB and checking for error.
document.addEventListener("DOMContentLoaded", () => {
    const bookingbtn = document.querySelector(".booking-button");
    bookingbtn.addEventListener("click", bookingParkingPlace);
});

// error checking, and if the vehicule is already reserved and not checked it's exit.
const validationError = () => {

    // NOTE: beside of these error type, i'll  check for this vehicule is already reserved or not by the matriculation and exitTime.
    // if the exit time empty that means that this vehicule is reserved and not checked it's exit.
    if ((bookDateTime == "" || bookDateTime == null) && (bookMatruculation == "" || bookMatruculation == null)) {
        return "Make sure to add Booking time & Matricule";
    } else if (bookDateTime == "" || bookDateTime == null) {
        return "Make sure to insert booking date.";
    } else if (bookMatruculation == "" || bookMatruculation == null) {
        return "Make sure to add booking matricule."
    } else if (trackSelectedSlotNumber == "") {
        return 'Make sure to select the zone for your vehicule';
    } else {
        return false;
    }
}

/* Parking area Section: */

//SELECT ZONE AREA.
// THE PROGRAM START FROM HERE.
const buildParkingZone = ({ slotNumber, plateNumber, available }, index) => {
    const zones = document.querySelector(".zones");

    zones.innerHTML += `<div class="zone ${index == 0 ? "isReserved" : ""}" data-slot-number=${slotNumber} 
            data-plate-number=${plateNumber == "" ? "" : plateNumber} data-available=${available}> 
                ${!available ? `<div class="reserved-zone"> <img src="images/vehicule.png" alt="vhicule-img" id="reserved-vehicule"> </div>` : `${slotNumber}`}
            </div>`
    if (index == 0 && plateNumber != "") {
        console.log('STTTTTTTTTTTTTTTTTTAAAAAAAAAAARTING', plateNumber)
        const firstRservation = {
            slotNumber: slotNumber,
            plateNumber: plateNumber,
            available: available
        }
        showVehiculeInfo(firstRservation);
    }
}
onload = () => {
    getAllPlaces().then(data => {
        data.map((item, index) => {
            console.log(item)
            buildParkingZone(item, index);
        });
    });


}
const zones = document.querySelector(".zones");

zones.addEventListener("click", (event) => {
    let zone = event.target.closest(".zone");
    if (!zone.classList.contains('isReserved')) {
        document.querySelector('.zone.isReserved')
            .classList
            .remove("isReserved");
        zone.classList.add('isReserved');
        trackSelectedSlotNumber = zone.dataset.slotNumber;
        selectedVehicule = {
            slotNumber: trackSelectedSlotNumber,
            plateNumber: zone.dataset.plateNumber, // matricule.
            available: zone.dataset.available,
        }
        console.log("slotData", selectedVehicule)
        // show vehicule info.
        showVehiculeInfo(selectedVehicule);

    }
});

// Current park.
const showVehiculeInfo = ({ slotNumber, plateNumber, available }) => {
    console.log("plateNumber", plateNumber);
    console.log("slotNumber", slotNumber);
    console.log("available", available);

    const disablingExitButton = document.querySelector(".exit");
    const vehiculeNumber = document.querySelector(".number");
    const duration = document.querySelector(".duration-vehicule");
    disablingExitButton.classList.remove('disabled');
    const vehiculeSlot = document.querySelector(".slot");
    const vehiculeType = document.querySelector("#vhicule-type");
    const vehiculeTypeName = document.querySelector("#vhicule-name");
    if (available == 'false' || available == false) {
        getReservationByMatricule(plateNumber).then(data => {
            let reserve = data[0];
            vehiculeNumber.innerHTML = reserve.plateNumber;
            duration.innerText = calculateDuration(reserve.entryTime) + " H";
            vehiculeSlot.innerHTML = reserve.slotNumber;
            const typeOfVehicule = reserve.type;
            if (typeOfVehicule == "truck") {
                vehiculeType.src = "images/truck.png";
            } else if (typeOfVehicule == "car") {
                vehiculeType.src = "images/sedan.png";
            } else {
                vehiculeType.src = "images/bike.png";
            }
            vehiculeTypeName.innerText = reserve.type;
        }).catch(err => {
            console.error(err);
        });
    } else if (available == "true" || available == false) {
        disablingExitButton.classList.add("disabled");
        vehiculeSlot.innerHTML = slotNumber;
        vehiculeTypeName.innerText = "Vehicule Type";
        vehiculeNumber.innerHTML = '....';
        duration.innerText = "... H";
        vehiculeType.src = "images/notfound.png";

    }

}

// Exit vehicule.
const exitingVehicule = document.querySelector(".exit");
const exitVehicule = () => {
    let newData = {
        available: true,
        slotNumber: trackSelectedSlotNumber,
        plateNumber: "N",
    }
    // update places
    exitVehiculeFromParking(trackSelectedSlotNumber, newData).then(data => {
        console.log(data);
        // Delete reservastion of this vehicule.

        getReservationByMatricule(selectedVehicule.plateNumber).then(data => {

        }).then(data => {
            let reserve = data[0];
            const now = new Date();
            const timeString = now.toTimeString().slice(0, 5);
            let exitTime = timeString;
            const updateVehicule = { ...reserve, exitTime: exitTime }
            console.log("Success", data)
            updateReservationExitTime(updateVehicule).then(data => {
                console.log("Success", data);
            }).catch(error => { console.log(error) })
        });
    }).catch(error => {
        console.log(error.errorMessage);
    });
}
// Handle existing vehicule.
exitingVehicule.addEventListener('click', exitVehicule)