* Cd into the folder and do yarn install
* Make sure you have postgresql installed in your device
* Run this command 'npx prisma migrate dev --name init" to deploy the schema into the database

your env variable should take the shape below
DATABASE_URL="postgresql://{username}:{password}@localhost:5432/{database_name}?schema=public"
ACCESS_TOKEN_SECRET= "any-key-you-wish"
EXPIRES_IN = "1h"

* Run this command to start the prisma studio "npx prisma studio"
* Inside the file theres a graphql schema for query named graphqlSchema
* To start the project run the command  "yarn run start:dev"
* Then go to this url in your browser http://localhost:3000/graphql