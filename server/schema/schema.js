const graphql = require('graphql')
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
} = graphql; 

const _ = require('lodash');

const Book = require('../models/book');
const Author = require('../models/author');
//Dummy Data
// var books = [
//     { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
//     { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
//     { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
//     { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
//     { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
//     { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
// ];


// var authors = [
//     {name: 'Patrick Rothfuss', age: 44, id: '1'},
//     {name: 'Brandon Sanderson', age: 48, id: '2'},
//     {name: 'Terry Pratchett', age: 52, id: '3'}
// ];


//BookType will be the type of object that will be used to query the database.
//We define the set of attributes it will have.
//This acts as the POJO class for a particular object in the database.
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ //If we need order for the fields then that should be implemented as a function.
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent,args){
                console.log(parent);
                // return _.find(authors, {id: parent.authorId});
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                console.log(parent);
                // return _.filter(books, {authorId: parent.id});
                return Book.find({authorId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: { //All kinds of root queries are wrapped inside this fields and as we dont need any order 
        //for it, therefore there is no need of implementing fields as a function.
        book: {
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                //Code to get data from the database or any other source
                //The type of database doesn't matter in the case of GraphQL
                // console.log(typeof(args.id))
                // return _.find(books,{id: args.id});
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent,args){
                // return _.find(authors,{id: args.id});
                return Author.findById(args.id);
                
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find([]);
                // When we pass an empty object it matches with everything and return all of the data
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find([]); 
                // When we pass an empty object it matches with everything and return all of the data
            }
        }
    }    
});

const Mutation = new GraphQLObjectType({
    name: 'Mutaiton',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent,args){
                let author = new Author({
                    name: args.name,
                    age: args.age,
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type:GraphQLString},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLID}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});