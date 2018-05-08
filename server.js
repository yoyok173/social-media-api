import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt  from 'jsonwebtoken';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import {
	graphqlExpress,
	graphiqlExpress,
} from 'apollo-server-express';

// graphql/apollo schema
import typeDefs from './graphql';

const SECRET = "YOU_SHOULD_CHANGE_THIS";
const PORT = process.env.PORT || 4000;
const server = express();

// attemps to dcode jwt token in request from client
// client should send token in authorization property of
// request headers, following pattern 'Bearer <TOKENDATA>'
const getUserFromToken = async (req) => {
	// parse token from headers
	const token = req.headers.authorization;
	if(!token) return req.next()
	const tokenParts = token.split(' ')
	const payload = tokenParts[1]

	// if token is found attempt to verify token against secret
	if(payload !== undefined || payload !== null ){
		try{
			const user = await jwt.verify(payload, SECRET);
			req.user = user; // store parsed user in request, pass into context
		} catch (noToken) {
			console.log("server.js: Error parsing token: ", noToken)
		}
	}
	req.next()
};

server.use(cors(), getUserFromToken, bodyParser.json());




server.use('/graphql', graphqlExpress( req => ({
	schema: typeDefs,
	// pass in data to your resolvers as a property of context
	context: { 
		user: req.user, // pass user into context to be accessed in resolvers
		SECRET
	}
})));


server.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));


// Wrap the Express server with websocket for subscriptions
const ws = createServer(server);
ws.listen(PORT, () => {
	console.log(`Apollo Server is now running on http://localhost:${PORT}`);
	// Set up the WebSocket for handling GraphQL subscriptions
	new SubscriptionServer({
		execute,
		subscribe,
		schema: typeDefs
	}, {
		server: ws,
		path: '/subscriptions',
	});
});