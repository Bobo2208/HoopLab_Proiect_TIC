const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 
require('dotenv').config();


const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 

app.get('/', (req, res) => {
  res.send('Serverul HoopLab este pornit și gata de baschet!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[HoopLab] Serverul rulează pe http://localhost:${PORT}`);
});