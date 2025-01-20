if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const session=require('express-session');
const MongoStore=require('connect-mongo');

const store=MongoStore.create({
    mongoUrl:process.env.MONGODB_URI,
    crypto:{
        secret:process.env.MONGO_SECRET,
    },
    touchAfter:24*3600
});

store.on("error",()=>{
console.log("ERROR IN MONGO STORE",err);
})

const sessionOptions={
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24*7 
    }
}

app.use(session(sessionOptions));

async function connection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected');
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = connection;