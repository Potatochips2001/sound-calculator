let divs = Array();
document.addEventListener('DOMContentLoaded', () => {
  divs.push(document.getElementById('joule2decibel'));
  divs.push(document.getElementById('decibel2joule'));
  divs.push(document.getElementById('psi2decibel'));
  divs.push(document.getElementById('decibel2psi'));
  divs.push(document.getElementById('decibel2dbm'));
  divs.push(document.getElementById('dbm2decibel'));
  divs.push(document.getElementById('mds'));
  divs.push(document.getElementById('inverse'));
});

document.addEventListener('input', () => {
  if (document.readyState === 'complete') {
    let divOption = document.getElementById('div-select').value;
    showOnly(document.getElementById(divOption));
    document.getElementById('formula').src = `img/${divOption}.png`;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) document.getElementById('btn').click();
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
  let decibels = joule2decibel(watts).toLocaleString();
  return decibels;
}

function mds(_bandwidth) {
  let k = 1.38064852e-23;
  let dbm = 10 * Math.log10(k * 2.7 * 1000) + 1.5 + 10 * Math.log10(_bandwidth);
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
  let power = _value * (1 / _distance ** 2);
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
      document.getElementById('result').textContent = `${decibel} decibels`;
      return 0;
    }
    case 'decibel2joule': {
      let decibels = document.getElementById('ui-decibel2joule').value;
      let joules = decibel2joule(decibels).toLocaleString();
      document.getElementById('result').textContent = `${joules} W/m^2`;
      return 0;
    }
    case 'psi2decibel': {
      let psi = document.getElementById('ui-psi2decibel').value;
      let joules = psi2joule(psi);
      let decibels = joule2decibel(joules).toLocaleString();
      document.getElementById('result').textContent = `${decibels} decibels`;
      return 0;
    }
    case 'decibel2psi': {
      let decibels = document.getElementById('ui-decibel2psi').value;
      let joules = decibel2joule(decibels);
      let psi = joule2psi(joules).toLocaleString();
      document.getElementById('result').textContent = `${psi} PSI`;
      return 0;
    }
    case 'decibel2dbm': {
      let decibel = document.getElementById('ui-decibel2dbm').value;
      let dbm = decibel2dbm(decibel);
      document.getElementById('result').textContent = `${dbm} dBm`;
      return 0;
    }
    case 'dbm2decibel': {
      let decibel = dbm2decibel(document.getElementById('ui-dbm2decibel').value).toLocaleString();
      document.getElementById('result').textContent = `${decibel} decibels`;
      return 0;
    }
    case 'mds': {
      let bandwitdth = document.getElementById('ui-mds').value;
      let dbm = mds(bandwitdth);
      document.getElementById('result').textContent = `${dbm} dBm`;
      return 0;
    }
    case 'inverse': {
      let value = document.getElementById('ui-inverse-value').value;
      let distance = document.getElementById('ui-inverse-distance').value;
      let valueUnit = document.getElementById('ui-inverse-value-unit').value;
      let power = inverse(value, distance);
      document.getElementById('result').textContent = `${power} ${valueUnit}`;
      return 0;
    }
  }
  return 1;
}
