const express = require ('express');
const dotenv = require ('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoute');
const { notFound,errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());


app.get('/', (req, res)=>{
    res.send('Api is running successfully')
})

//route for user api
app.use('/api/user',userRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`server started on port ${PORT}`));
