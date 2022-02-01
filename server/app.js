const express = require('express');
const {graphqlHTTP} = require('express-graphql'); 
const mongoose = require('mongoose');

const schema = require('./schema/schema');

const app = express();

//Connecting to MongoDB using the connection url provided when creating the database
mongoose.connect('mongodb+srv://udbhav:root@cluster0.pwplm.mongodb.net/React_graphql?retryWrites=true&w=majority')
mongoose.connection.once('open',()=>{
    console.log('Connection Made');
});


app.use('/graphql', graphqlHTTP({
        schema,
    graphiql: true
}));


app.listen(4000, ()=> {
    console.log('Now listening for requests on port 4000');
})

