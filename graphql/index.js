const { makeExecutableSchema } = require('graphql-tools');

// types
const typeDefs = require('./types.graphql');

// resolvers
const resolvers = require('./resolvers');

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

export default schema;