# Makhloufi & Terpend application
#!/bin/bash # Uncomment 
cd api
# Install node-modules
npm install
# Start the server node.js
node server.js &
cd ..
# Install ionic
#npm install -g cordova ionic
# Launch Ionic
ionic serve
