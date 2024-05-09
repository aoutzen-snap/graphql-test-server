import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import typeDefs from './api/schema';
import resolvers from './api/resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';

const PORT = 4000;

const app = express();

app.get('/', (req, res) => {
    res.send(`Server is running on http://localhost:${PORT}. Go to http://localhost:${PORT}/graphql 
    in your browser to access the GraphiQL testing tool, or send GraphQL requests to that endpoint with an external tool.`);
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log(`GraphQL server is running on localhost:${PORT}/graphql`)
    console.log(`This server is using Nodemon. It will restart automatically when changes to the source code are changed.`);
});