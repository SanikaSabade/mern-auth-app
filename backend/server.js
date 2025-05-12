const express = require('express')
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 
const app = express()
const adminRoutes = require('./routes/admin.route');



app.use(cors());
 app.use(express.json());



 app.use('/api/auth', require('./routes/authRoutes'));
 app.use('/api/form', require('./routes/formRoutes'));
 app.use('/api/admin', adminRoutes);


connectDB().then(() => {
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
  });
});




