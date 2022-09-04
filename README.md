# sound-calculator
Interesting info: If you convert Boltzmann's constant (1.38e-23) joules to dBm you get -198 dBm
### Explanation to minimum detectable signal
![](/img/mds.png) <br/>
k = <a href="https://en.wikipedia.org/wiki/Boltzmann_constant">Boltzmann's constant</a> (1.38064852e-23 J/K) <br/>
T = Temperature in kelvin, is set to 2.7 K (temperature in space) <br/>
NF = Receiver noise figure in dB (default is 1.5)
### dBm explanation
dBm is decibels per milliwatt; milliwatt to dBm is 10 * log10(mW) <br/>
or mW = 10<sup>dBm/10</sup>
