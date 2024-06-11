<h1 align="center">
🌐 MUSIC Playlist Generator
</h1>
<p align="center">
Neo4j, Expressjs, React/Redux, Nodejs
</p>


>  MUSIC Playlist Generator is a fullstack implementation in Neo4j, Expressjs, React/Redux, Nodejs.

## clone or download
```terminal
$ git clone https://github.com/rohit-batra-1307/movieplaylistgenerator.git
$ npm install or npm i 
```

## project structure
```terminal
LICENSE
package.json
server/
   package.json
   .env (to create .env, check [prepare your secret session])
client/
   package.json
...
```

# Usage (run fullstack app on your machine)

## Prerequisites
- [Neo4j](https://neo4j.com/cloud/platform/aura-graph-database/)
- [Node](https://nodejs.org/en/download/) 
- [npm](https://nodejs.org/en/download/package-manager/)

notice, you need client and server runs concurrently in different terminal session, in order to make them talk to each other

## Client-side usage(PORT: 3000)
```terminal
$ cd client          // go to client folder
$ yarn # or npm i    // npm install packages
$ npm install react-scripts --save // To start scripts
$ npm run start        // run it locally

// deployment for client app
$ npm run build // this will compile the react code using webpack and generate a folder called docs in the root level
$ npm run start // this will run the files in docs, this behavior is exactly the same how gh-pages will run your static site
```

## Server-side usage(PORT: 5001)

### Prepare your secret

run the script at the first level:

(You need to add a NEO4J_API in .env to connect to Neo4j)

```terminal
// in the root level
$ cd server
```

### Start

```terminal
$ cd server   // go to server folder
$ npm i       // npm install packages
$ npm run start // run it locally
$ npm run build // this will build the server code to es5 js codes and generate a dist file
```
# Screenshots of this project

User visit public and Home page and search movie from OMDB Database
[![User visit public and Home page](https://drive.google.com/uc?export=view&id=1zFGsdFqA6SpbAnCZcPaN85QdFXmP2fb8)](https://drive.google.com/file/d/1zFGsdFqA6SpbAnCZcPaN85QdFXmP2fb8/view?usp=sharing)

User can sign in or sign up
[![User can sign in or sign up](https://drive.google.com/uc?export=view&id=1SC4qquVWv3lX9pmS_dEWr6sRgSVr5tK6)](https://drive.google.com/file/d/1SC4qquVWv3lX9pmS_dEWr6sRgSVr5tK6/view?usp=drive_link)

After signing in user can go to account route and see his movie playlist
[![After signing in user can go to account route](https://drive.google.com/uc?export=view&id=1sgGfH4DsuOdv0SInmeyIm9qvy9XcP0KN)](https://drive.google.com/file/d/1sgGfH4DsuOdv0SInmeyIm9qvy9XcP0KN/view?usp=sharing)

