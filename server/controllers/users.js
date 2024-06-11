import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { driver, createSession } from '../neo4jSession.js';


const login = async (req, res) => {
    const session = createSession();
    const { email, password } = req.body;
    try {
        const result = await session.run(
            'MATCH (u:User {email: $email}) RETURN u, u.password AS passwordHash,u.id as userId',
            { email }
        );
        
        if (result.records.length === 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const user = result.records[0].get('u');
        const storedPasswordHash = result.records[0].get('passwordHash');
        const userId= result.records[0].get('userId');
        
        const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);
        
        if (!isPasswordValid) {
            // console.log("Invalid Password")
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ email: user.properties.email, id: user.properties.id }, "jwt123", { expiresIn: '24h' });
        console.log(user.properties);
        res.status(200).json({ result: user.properties, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    } finally {
        await session.close();
    }
};

const signup = async (req, res) => {
    const session = createSession();
    const { username, email, password, confirmPassword } = req.body;

    try {
        const existingUser = await session.run(
            'MATCH (u:User {email: $email}) RETURN u',
            { email }
        );

        if (existingUser.records.length > 0) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ msg: 'Passwords do not match' });
        }

        const encryptedPassword = await bcrypt.hash(password, 12);

        const result = await session.run(
            'CREATE (u:User {id: $id, username: $username, email: $email, password: $password}) RETURN u',
            { id: uuidv4(), username, email, password: encryptedPassword }
        );

        const newUser = result.records[0].get('u');

        const token = jwt.sign({ email: newUser.properties.email, id: newUser.properties.id }, "jwt123", { expiresIn: '24h' });

        res.status(201).json({ result: newUser.properties, token });

    } catch (error) {
        res.status(500).json({ msg: 'Something went wrong' });
    } finally {
        await session.close();
    }
};

export { login, signup };
