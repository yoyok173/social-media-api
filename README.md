# Basic Apollo Graphql Server


## Whats included?

Lets take a look at the graphql schema provided

``` typescript

    // User Type
    type User {

        email: String 
        token: String

    }


    // Queries
    type Query {

        users: [User]

    }

    // Mutations
    type Mutation {

        // signin, password hashing out of the box!
        signup( email: String!, password: String! ) : User!

        // json web tokens ready!
        signin( email: String!, password: String! ) : User!

    }


    // Subscriptions
    type Subscription {

        // subscriptions up and running!
        userAdded (fullRepoName: String! ) : User!
      
    }

```

## Signup, Signin, Password Hash, JWT Authentication, and GraphQL Subscriptions all preconfigured and ready to go. 

---

`git clone https://github.com/Matthew-Jimenez/GraphQl-Api-Boilerplate.git`


`cd GraphQL-Api-Boilerplate && yarn install`

`yarn start`


API is up and running @ localhost:4000/graphiql
---

Coming soon, instructions on connecting to mlab with mongoose or heroku postgresql with sequelize. 


