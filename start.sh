# Makhloufi & Terpend application
#!/bin/bash # Uncomment 
#chmod +x # Uncomment
# Launch the server node.js
#Go to the api folder
cd api
# install node-modules
npm install
# start the server node.js
node server.js &
# Go to the parent's folder
cd ..
# launch Ionic
ionic serve
