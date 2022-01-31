const graphql = require('graphql')

const { GraphQLObjectType } = graphql; 

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        
    })
})