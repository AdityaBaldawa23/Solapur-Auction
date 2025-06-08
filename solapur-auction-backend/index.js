require("dotenv").config(); 
const express = require('express');
const cors = require('cors');
const mongoDB = require('./db');
const app = express();
const port = 5000;
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoDB();

const playerRoutes = require('./Routes/playerStoringRoute'); 
app.use('/player', playerRoutes);

const teamRoutes = require('./Routes/teamStoringRoute.js');
app.use('/team', teamRoutes);

const getTeams = require('./Routes/FetchingTeamsRoute.js');
app.use('/api', getTeams);

const getPlayer = require('./Routes/fetchingPlayerRoute.js');
app.use('/api/auction', getPlayer);

const sellPlayer = require('./Routes/sellPlayerRoute.js');
app.use('/api', sellPlayer);

const reAuctionRoutes = require('./Routes/reauctionListRoutes.js');
app.use('/api/reauction', reAuctionRoutes);

const adminlogin = require('./Routes/AdminLoginRoute.js');
app.use('/admin', adminlogin);

app.listen(port,'0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
