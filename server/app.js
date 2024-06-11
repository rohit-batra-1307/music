import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import MovieRoutes from './routes/movies.js';
import userRoutes from "./routes/users.js";
import { driver, createSession } from './neo4jSession.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({limit: "32mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "32mb", extended: true}));
app.use(cors());

app.use("/movies", MovieRoutes);
app.use("/user", userRoutes);

app.get('/', (req,res) => {
    res.send('Welcome to the movie playlist Store');
});

const PORT = process.env.PORT || 5001;

const connectDB = async() => {
    const session = createSession();
    try{
        await session.run('RETURN 1');
        console.log('Neo4j database constraints initialized.');
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch(error){
        console.error('Connection to Neo4j failed', error.message);
    } finally{
        await session.close();
    }
};
connectDB();

driver.onCompleted = () => console.log('Connected to Neo4j database successfully');
driver.onError = (error) => console.error('Error connecting to Neo4j', error);

process.on('exit', () => driver.close());
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

export default app;