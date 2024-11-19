require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./controller/database");
const PORT = process.env.PORT || 4000;
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(morgan('common'));



app.use(require('./services/user/user'));
app.use(require('./services/blog/blog'));
app.use(require('./services/course/course'));
app.use(require('./services/statsApi/stats'));
app.use(require('./services/instructor/instructor'));
app.use(require('./services/order/order'));


app.get('/health', async(req, res)=>{
    res.status(200).send('Yo Yo!');
});


async function start(){
    try {
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`=> Server is listening on http://127.0.0.1:${PORT}`)
        })
        
    } catch (error) {
        console.log(error)
        
    }

}


start();

