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
});

const c = 299792458;

document.addEventListener('input', () => {
    if (document.readyState === 'complete') {
        let divOption = document.getElementById('div-select').value;
        showOnly(document.getElementById(divOption));
        document.getElementById('formula').src = `img/${divOption}.png`;
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
    switch (valueUnit) {
        case 'dbm': {
            _value = 10 ** (_value / 10);
            break;
        }
        case 'db': {
            _value = Math.pow(10, -12) * Math.pow(10, _value / 10);
            break;
        }
        default: {
            //default is regular units/joules; do nothing
        }
    }
    switch (distanceUnit) {
        case 'km': {
            _distance *= 1000;
            break;
        }
        case 'ly': {
            _distance *= 9.454255e+15;
            break;
        }
        default: {
            //meters is default value; do nothing
        }
    }
    //let power = _value * (1 / _distance ** 2); old
    let power = _value / (4 * Math.PI * _distance**2);
    switch (valueUnit) {
        case 'dbm': {
            power = 10 * Math.log10(power);
            break;
        }
        case 'db': {
            power = 10 * Math.log10(power / Math.pow(10, -12));
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
            document.getElementById('result').textContent = `${joules.toLocaleString()} W/m^2`;
            return 0;
        }
        case "dbm2joule": {
            let dbm = document.getElementById("ui-dbm2joule").value;
            let decibel = dbm2decibel(dbm);
            let joule = decibel2joule(decibel);
            document.getElementById("result").textContent = `${joule.toLocaleString()} W/m^2`;
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
            let power = inverse(value, distance);
            if (valueUnit == "unit"){
                document.getElementById("result").textContent = `${power} ${valueUnit}`;
            } else {
                document.getElementById("result").textContent = `${power.toLocaleString()} ${valueUnit}`;
            }
            return 0;
        }
    }
    return 1;
}
