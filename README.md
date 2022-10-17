## HotTakes P6

HotTakes is an online shop for hot sauce.
This repository contains the backend of this shop.
To start the server on your computer you need 
to clone the repository to this address `https://github.com/ThevenonT/HotTakes_P6.git`.
go to the backend folder and install dependencies.

# INSTALL DEPENDENCIES
run `npm install` to install the required dependencies then add the .env file

# .env
CONNEXION_MONGO_DB=`Url`
ACCESS_TOKEN_SECRET=`token aléatoire`
PORT=`server connection port`

# PORT
`port 3000` must be free or specify the desired port in the environment file 

# START THE SERVER
run `node run start` or `nodemon run start` to start the backend server on `port: 3000`.

# MongoDB
mongoDb connection information must be filled in the environment file and wait for the connection response to mongoDb. 
Once the connection to mongoDB is established, the server is operational.
