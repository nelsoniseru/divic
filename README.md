* cd into the folder and do yarn install
* make sure you have postgresql installed in your device
* run this command 'npx prisma migrate dev --name init" to deploy the schema into the database

your env variable should take the shape below
DATABASE_URL="postgresql://{username}:{password}@localhost:5432/{database_name}?schema=public"
ACCESS_TOKEN_SECRET= "any-key-you-wish"
REFRESH_TOKEN_SECRET= "any-key-you-wish"
EXPIRES_IN = "1h"

* run this command to start the prisma studio "npx prisma studio"
* inside the file theres a graphql schema for query name graphqlSchema
* to start the project run the command  "yarn run start:dev"