import { PubSub } from  'graphql-subscriptions';
import   bcrypt   from 	'bcrypt';
import   jwt 		  from  'jsonwebtoken';
import   _        from  'lodash';



const pubsub = new PubSub();

const USER_ADDED = "USER_ADDED";

// fake data
// password decrypted is '1'
let fakeUsers = [
  { email: "test@email.com", password: "$2b$12$.I5YOucUe54xFRyNaoL1veMWv92YR0lfsFo4eiDqjYEMvapo0zNna", id: 1 },
  { email: "email@test.com", password: "$2b$12$.I5YOucUe54xFRyNaoL1veMWv92YR0lfsFo4eiDqjYEMvapo0zNna", id: 2 }  
]



// start of resolvers
const rootResolver = {



  Query: {
    users: () => {
      return fakeUsers
    }
  }, // end query resolver





  Mutation: {

    signup: async (pV, { email, password }, { SECRET }) => {

      pubsub.publish(USER_ADDED, { message: `A new user with email: ${email}, just joined!` })

      // hash password with bcrypt
      const hashedPass = await bcrypt.hash(password, 12)
      // call pubsub publish
      fakeUsers.push({email, password: hashedPass}); // add to real database here

      
      const token = await jwt.sign( { email }, SECRET, { expiresIn: '24h' } )
      const userWithToken = {
        token,
        email
      }

      return userWithToken;
    }, // end signupUser


    signin: async (pV, { email, password }, { SECRET }) => {

      // look for user
      const userFound = await _.find(fakeUsers, { email })
      if(!userFound) return new Error('Incorrect email');

      // check password
      const passwordValid = await bcrypt.compare(password, userFound.password)
      if(!passwordValid) return new Error('Incorrect password');

      // get auth token
      const token = await jwt.sign( { email }, SECRET, { expiresIn: '24h' } )
      

      let user = {
        email: userFound.email,
        token
      }

      return user
    } // end signin
    

  }, // end mutations





  Subscription: {

		userAdded: {
			resolve: (data) => { 
        // return the user that was added
        return data;
			},
			subscribe: (parentVals, args) => {
        console.log('subscribed to usersAdded')
				return pubsub.asyncIterator(USER_ADDED);
			}
    }
    
	}, // end subscriptions









}

module.exports = rootResolver