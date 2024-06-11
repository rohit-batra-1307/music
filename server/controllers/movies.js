import {v4 as uuidv4} from 'uuid';
import {driver, createSession} from '../neo4jSession.js'

const getMovies = async (req, res) => {
    const session = createSession();
    try {
        const userId = req.params.userId;
        const result = await session.run('MATCH (p:User {id: $userId})-[:POSTED]->(b:Movie) RETURN b', { userId });
        const movies = result.records.map((record) => record.get('b').properties);
        if (movies.length === 0) {
            res.status(202).json({ message: "No movies in the playlist" });
        } else {
            res.status(200).json(movies);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    } finally {
        await session.close();
    }
};



// const getMovie = async (req, res) => {
//     const session = createSession();
//     try{
//         const userId=req.params.userId;
//         const value=req.params.value;
//         const result = await session.run(
//             'MATCH (p:User {id: $userId})-[:POSTED]->(b:Movie {name: $value}) RETURN b',
//             { userId, value }
//         );
//         const movies = result.records.map((record)=> record.get('b').properties);
//         res.status(200).json(movies);
//     } catch(error){
//         res.status(404).json({message: error.message})
//     } finally{
//         await session.close();
//     }
// };
const getMovie = async (req, res) => {
    const session = createSession();
    try {
        const userId = req.params.userId;
        const value = req.params.value;
        const result = await session.run(
            'MATCH (p:User {id: $userId})-[:POSTED]->(b:Movie) WHERE b.name CONTAINS $value OR b.remarks CONTAINS $value OR  b.movieStatus CONTAINS $value OR  b.starcast CONTAINS $value RETURN b',
            { userId, value }
        );
        const movies = result.records.map((record) => record.get('b').properties);
        
        res.status(200).json(movies);
    } catch (error) {
        res.status(404).json({ message: error.message });
    } finally {
        await session.close();
    }
};

// const getMovie = async (req, res) => {
//     const session = createSession();
//     try {
//         const userId = req.params.userId;
//         const attribute = req.params.attribute;
//         const value = req.params.value;
//         const query = `MATCH (p:User {id: $userId})-[:POSTED]->(b:Movie {${attribute}: $value}) RETURN b`;

//         const result = await session.run(query, { userId, value });
//         const movies = result.records.map((record) => record.get('b').properties);
        
//         res.status(200).json(movies);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     } finally {
//         await session.close();
//     }
// };



const createMovie = async (req, res) => {
    const session = createSession();

    try {
        const { name, starcast, movieStatus, movie, remarks, image, userId } = req.body;
        const movieId = uuidv4();

        // Check if the movie already exists for the particular user
        const existingMovieResult = await session.run(
            `
            MATCH (u:User {id: $userId})-[:POSTED]->(m:Movie {name: $name})
            RETURN m
            `,
            { userId, name }
        );

        if (existingMovieResult.records.length > 0) {
            // Movie already exists for the particular user
            res.status(202).json({ message: "Movie with the same name already exists for the user." });
            return;
        }

        // Create the new movie node
        const result = await session.run(
            `
            MATCH (u:User {id: $userId})
            CREATE (b:Movie {id: $movieId, name: $name, starcast: $starcast, movieStatus: $movieStatus, movie: $movie, remarks: $remarks, image: $image, postedBy: $userId})
            MERGE (u)-[:POSTED]->(b)
            RETURN b
            `,
            { userId, movieId, name, starcast, movieStatus, movie, remarks, image }
        );

        const newMovie = result.records[0].get('b').properties;
        console.log("New Movie",newMovie);
        res.status(201).json(newMovie);
        

    } catch (error) {
        console.error(error);
        res.status(409).json({ message: error.message });
    } finally {
        await session.close();
    }
};




// const editMovie = async(req, res) => {
//     const session = createSession();
//     try{
//         // const {id} = req.params;
//         const {name, starcast, price, image , userId} = req.body;
//         const result = await session.run(
//             'MATCH (b:Movie {id: $userId}) SET b += {name: $name, starcast: $starcast, price: $price, image: $image} RETURN b',
//             {userId, name, starcast, price, image}
//         );
//         console.log(id);
//         const updatedMovie = result.records[0].get('b');
//         res.json({result: updatedMovie.properties});
//     } catch(error){
//         res.status(404).json({message: error.message});
//     } finally{
//         await session.close();
//     }
// };

const editMovie = async (req, res) => {
    const session = createSession();
    try {
        const { name, starcast, movieStatus, movie, remarks, image,userId} = req.body;
        const { id } = req.params
       
        const checkUserResult = await session.run(
            'MATCH (u:User {id: $userId})-[:POSTED]->(b:Movie {id: $id}) RETURN u',
            { userId, id }
        );
        if (checkUserResult.records.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to edit this movie.' });
        }
        const updateResult = await session.run(
            'MATCH (b:Movie {id: $id}) SET b += {name: $name, starcast: $starcast, movieStatus: $movieStatus, movie: $movie, remarks: $remarks,image:$image} RETURN b',
            { id, name, starcast, movieStatus, movie, remarks,image}
        );
     
        
        const updatedMovie = updateResult.records[0].get('b').properties;
        
        res.status(201).json(updatedMovie);
 
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error'});
    } finally {
        await session.close();
    }
};


const deleteMovie = async (req, res) => {
    const {id} = req.params;
    const session = createSession();
    try{
        await session.run('MATCH (b:Movie {id: $id}) DETACH DELETE b', { id });
        res.json({ message: 'Movie deleted successfully' });
    } catch(error){
        res.status(404).json({message: error.message});
    } finally{
        await session.close();
    }
};
export {getMovies,getMovie, createMovie, editMovie, deleteMovie};