A Real Time Chat Application built using Node.js, Express, MYSQL , Socket.io, JWT
# Features
* Uses Express as the application Framework.
* Manages authentication  using [express jwt  package](https://www.npmjs.com/package/jwt-express).
* Passwords are hashed using [md5 package](https://www.npmjs.com/package/md5) .
* Real-time communication between a client and a server using [Socket.io](https://socket.io/).
* Uses [Sequelize ORM](https://github.com/sequelize/sequelize) for storing and querying data to MYSQL.
* - [x] After User Logging to the system , he can see all users in the system.
* - [x] Can define each user is online or offline.
* - [x] User can messaging with any user in the system , see all previous messages (private messages).
* - [x] When user send a new message to another user , he get notification that he has a new message.

# incomming Features:
* - [ ] When user send message to another one and that one is offline , get get notification
after login agian that he has new message from sender user.


> # Installation steps:

* make sure you have mysql , node js and npm installed in your operation system .
* Create new database named chat .
* Clone or Download the repository
```
git clone https://github.com/amirhamdy4b/real-time-chat.git
```
* Install Dependencies
```
npm install
npm install sequelize-cli -g
```
* Edit configuration file in config/dbconfig.json with your credentials.
* run migrations to create tables in database.
```
* sequelize db:migrate --config config/dbconfig.json
```
* run seeds to insert 5 new user in database to be used in the system.
```
* sequelize db:seed:all --config config/dbconfig.json
```
* Start the application
```
* npm start
```
Your app should now be running on localhost:3000.
