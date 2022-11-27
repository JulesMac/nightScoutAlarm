# nightScoutAlarm
Raspberry-pi alarm for Hi/Lo SG levels

install

npm install
npm run build
node build/Release/app.js

# Setup ubuntu
- Install and image using ubuntu docs
- sudo apt-get update && sudo apt-get upgrade
- install node - https://github.com/nodesource/distributions/blob/master/README.md#debinstall
- setup startup script - https://linuxconfig.org/how-to-run-script-on-startup-on-ubuntu-20-04-focal-fossa-server-desktop
- add this line using visudo   
  pi      ALL=(ALL:ALL) ALL

