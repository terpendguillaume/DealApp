# Makhloufi & Terpend application
#!/bin/bash # Uncomment 
#chmod +x # Uncomment
cd api
# Install node-modules
npm install
# Start the server node.js
node server.js &
cd ..
# Install ionic
#npm install -g cordova ionic #Uncomment
# Launch Ionic
ionic serve
