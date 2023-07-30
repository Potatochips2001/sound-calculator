let divs = Array();
document.addEventListener('DOMContentLoaded', () => {
    divs.push(document.getElementById('joule2decibel'));
    divs.push(document.getElementById("joule2dbm"));
    divs.push(document.getElementById('decibel2joule'));
    divs.push(document.getElementById("dbm2joule"));
    divs.push(document.getElementById('psi2decibel'));
    divs.push(document.getElementById('decibel2psi'));
    divs.push(document.getElementById('decibel2dbm'));
    divs.push(document.getElementById('dbm2decibel'));
    divs.push(document.getElementById('mds'));
    divs.push(document.getElementById("gain"));
    divs.push(document.getElementById('inverse'));
    divs.push(document.getElementById('anti-inverse'));
    divs.push(document.getElementById('anti-inverse-power'));
});

const c = 299792458;
const ly = c * 3600 * 24 * 365;

document.addEventListener('input', () => {
    if (document.readyState === 'complete') {
        let divOption = document.getElementById('div-select').value;
        showOnly(document.getElementById(divOption));
        document.getElementById('formula').src = `img/${divOption}.png`;
        let divHeight = document.getElementById(divOption).offsetHeight;
        document.getElementById("btn").style = `margin-top: ${divHeight}px`;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') document.getElementById("btn").click();
});

function showOnly(_divName) {
    divs.forEach(element => {
        if (element.id == _divName.id) {
            document.getElementById(element.id).style = 'visibility: visible';
        } else {
            document.getElementById(element.id).style = 'visibility: hidden';
        }
    });
    return 0;
}

function joule2decibel(_joules) {
    let returnDecibels = 10 * Math.log10(_joules / Math.pow(10, -12));
    return returnDecibels;
}

function decibel2joule(_decibels) {
    let returnJoules = Math.pow(10, -12) * Math.pow(10, _decibels / 10);
    return returnJoules;
}

function joule2psi(_joules) {
    let returnPSI = _joules / 6894.76;
    return returnPSI;
}

function psi2joule(_psi) {
    let returnJoule = _psi * 6894.76;
    return returnJoule;
}

function decibel2dbm(_decibel) {
    let milliwatts = decibel2joule(_decibel) * 1000;
    let dbm = 10 * Math.log10(milliwatts);
    return dbm;
}

function joule2dbm(_joules){
    return 10 * Math.log10(1e3 * _joules);
}

function dbm2joule(_dbm){
    return 10**(_dbm/10) / 1e3;
}

function dbm2decibel(_dbm) {
    let milliwatts = 10 ** (_dbm / 10);
    let watts = milliwatts / 1000;
    let decibels = joule2decibel(watts);
    return decibels;
}

function frequency2wavelength(hz){
    let wave = c / hz;
    return wave;
}

function m2ly(m){
    return m / ly;
}

function ly2m(_ly){
    return ly * _ly;
}

function gain(_efficiency, _aperture, _wavelength){
    let gain = 10 * Math.log10(4 * Math.PI * _efficiency * _aperture / _wavelength**2);
    return gain;
}

function mds(_bandwidth, temp = 2.7) {
    let k = 1.38064852e-23;
    let dbm = 10 * Math.log10(k * temp * 1000) + 1.5 + 10 * Math.log10(_bandwidth);
    return dbm
}

function inverse(_value, _distance) {
    let valueUnit = document.getElementById('ui-inverse-value-unit').value;
    let distanceUnit = document.getElementById('ui-inverse-distance-unit').value;
    let intensityUnit = document.getElementById("ui-inverse-intensity-unit").value;
    switch (valueUnit){
        case "dB": {
            _value = decibel2joule(_value);
            break;
        }
        case "dBm": {
            _value = dbm2joule(_value);
            break;
        }
        default: {
            break;
        }
    }
    switch (distanceUnit){
        case "km": {
            _distance /= 1e3;
            break;
        }
        case "ly": {
            _distance = ly2m(_distance);
            break;
        }
        default: {
            break;
        }
    }
    let intensity = _value / (4 * Math.PI * _distance**2);
    switch (intensityUnit){
        case "dB": {
            intensity = joule2decibel(intensity);
            break;
        }
        case "dbm": {
            intensity = joule2dbm(intensity);
            break;
        }
        default: {
            break;
        }
    }
    return intensity;
}

function anti_inverse(power, intensity){
    let powerUnit = document.getElementById("ui-anti-inverse-power-unit").value;
    let intensityUnit = document.getElementById("ui-anti-inverse-intensity-unit").value;
    let distanceUnit = document.getElementById("ui-anti-inverse-distance-unit").value;
    switch (powerUnit){
        case "dB": {
            power = decibel2joule(power);
            break;
        }
        case "dBm": {
            power = dbm2joule(power);
            break;
        }
        default: {
            break;
        }
    }
    switch (intensityUnit){
        case "dB": {
            intensity = decibel2joule(intensity);
        }
        case "dBm": {
            intensity = dbm2joule(intensity);
            break;
        }
        default: {
            break;
        }
    }
    let distance = Math.sqrt( power / intensity / Math.PI / 4 );
    switch (distanceUnit){
        case "km": {
            distance /= 1e3;
            break;
        }
        case "ly": {
            distance = m2ly(distance);
            break;
        }
        default: {
            break;
        }
    }
    return distance;
}

function anti_inverse_power(intensity, distance){
    let intensityUnit = document.getElementById("ui-anti-inverse-power-intensity-unit").value;
    let distanceUnit = document.getElementById("ui-anti-inverse-power-distance-unit").value;
    let powerUnit = document.getElementById("ui-anti-inverse-power-power-unit").value;
    switch (intensityUnit){
        case "dB": {
            intensity = decibel2joule(intensity);
            break;
        }
        case "dBm": {
            intensity = dbm2joule(intensity);
        }
        default: {
            break;
        }
    }
    switch (distanceUnit){
        case "km": {
            distance = distance * 1e3;
            break;
        }
        case "ly": {
            distance = ly2m(distance);
            break;
        }
        default: {
            break;
        }
    }
    let power = intensity * (4 * Math.PI * distance**2);
    switch (powerUnit) {
        case "dB": {
            power = joule2decibel(power);
            break;
        }
        case "dBm": {
            power = joule2dbm(power);
        }
        default: {
            break;
        }
    }
    return power;
}

function calculate() {
    let uiSelect = document.getElementById('div-select').value;
    switch (uiSelect) {
        case 'joule2decibel': {
            let joules = document.getElementById('ui-joule2decibel').value;
            let decibel = joule2decibel(joules).toLocaleString();
            document.getElementById('result').textContent = `${decibel.toLocaleString()} decibels`;
            return 0;
        }
        case "joule2dbm": {
            let joules = document.getElementById("ui-joule2dbm").value;
            let decibel = joule2decibel(joules);
            let dbm = decibel2dbm(decibel);
            document.getElementById("result").textContent = `${dbm.toLocaleString()} dBm`;
            return 0;
        }
        case 'decibel2joule': {
            let decibels = document.getElementById('ui-decibel2joule').value;
            let joules = decibel2joule(decibels).toLocaleString();
            document.getElementById('result').textContent = `${joules} W/m^2`;
            return 0;
        }
        case "dbm2joule": {
            let dbm = document.getElementById("ui-dbm2joule").value;
            let decibel = dbm2decibel(dbm);
            let joule = decibel2joule(decibel);
            document.getElementById("result").textContent = `${joule} W/m^2`;
            return 0;
        }
        case 'psi2decibel': {
            let psi = document.getElementById('ui-psi2decibel').value;
            let joules = psi2joule(psi);
            let decibels = joule2decibel(joules);
            document.getElementById('result').textContent = `${decibels.toLocaleString()} decibels`;
            return 0;
        }
        case 'decibel2psi': {
            let decibels = document.getElementById('ui-decibel2psi').value;
            let joules = decibel2joule(decibels);
            let psi = joule2psi(joules).toLocaleString();
            document.getElementById('result').textContent = `${psi.toLocaleString()} PSI`;
            return 0;
        }
        case 'decibel2dbm': {
            let decibel = document.getElementById('ui-decibel2dbm').value;
            let dbm = decibel2dbm(decibel);
            document.getElementById('result').textContent = `${dbm.toLocaleString()} dBm`;
            return 0;
        }
        case 'dbm2decibel': {
            let decibel = dbm2decibel(document.getElementById('ui-dbm2decibel').value).toLocaleString();
            document.getElementById('result').textContent = `${decibel.toLocaleString()} decibels`;
            return 0;
        }
        case 'mds': {
            let bandwitdth = document.getElementById('ui-mds').value;
            let temp = Number(document.getElementById("ui-mds-temp").value);
            let tempUnit = document.getElementById("ui-mds-unit").value;
            if (tempUnit == "c") temp += 273.15;
            if (tempUnit == "f") temp = (temp - 32) * (5/9) + 255.372;
            let dbm = mds(bandwitdth, temp);
            document.getElementById('result').textContent = `${dbm.toLocaleString()} dBm`;
            return 0;
        }
        case 'gain': {
            let efficiency = document.getElementById("ui-gain-ef").value;
            const measureUnit = document.getElementById("gain-ar-select").value;
            let aperture = document.getElementById("ui-gain-ar").value;
            if (measureUnit === "ft"){
                aperture /= 3.28;
            }
            const wavelengthOption = document.getElementById("gain-wa-select").value;
            let wavelength = document.getElementById("ui-gain-wa").value;
            if (wavelengthOption === "frequency"){
                wavelength = frequency2wavelength(wavelength);
            }
            let gdb = gain(efficiency, aperture, wavelength);
            document.getElementById("result").textContent = `${gdb.toLocaleString()} dB`;
            return 0;
        }
        case 'inverse': {
            let value = document.getElementById('ui-inverse-value').value;
            let distance = document.getElementById('ui-inverse-distance').value;
            let valueUnit = document.getElementById('ui-inverse-value-unit').value;
            let uiIntensitySelectedIndex = document.getElementById("ui-inverse-intensity-unit").selectedIndex;
            let uiIntensityUnit = document.getElementById("ui-inverse-intensity-unit")[uiIntensitySelectedIndex].text;
            let intensity = inverse(value, distance);
            document.getElementById('result').textContent = `${intensity.toLocaleString()} ${uiIntensityUnit}`;
            return 0;
        }
        case "anti-inverse": {
            let uiPower = document.getElementById("ui-anti-inverse-power").value;
            let uiIntensity = document.getElementById("ui-anti-inverse-intensity").value;
            let uiDistanceSelectIndex = document.getElementById("ui-anti-inverse-distance-unit").selectedIndex;
            let uiDistanceUnit = document.getElementById("ui-anti-inverse-distance-unit")[uiDistanceSelectIndex].text;
            let distance = anti_inverse(uiPower, uiIntensity);
            document.getElementById("result").textContent = `${distance.toLocaleString()} ${uiDistanceUnit.toLowerCase()}`;
            return 0;
        }
        case "anti-inverse-power": {
            let uiIntensity = document.getElementById("ui-anti-inverse-power-intensity").value;
            let uiDistance = document.getElementById("ui-anti-inverse-power-distance").value;
            let uiPowerSelectIndex = document.getElementById("ui-anti-inverse-power-power-unit").selectedIndex;
            let uiPowerUnit = document.getElementById("ui-anti-inverse-power-unit")[uiPowerSelectIndex].text;
            let power = anti_inverse_power(uiIntensity, uiDistance);
            document.getElementById("result").textContent = `${power.toLocaleString()} ${uiPowerUnit}`;
            return 0;
        }
    }
    return 1;
}
