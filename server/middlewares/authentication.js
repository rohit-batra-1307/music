import jwt from "jsonwebtoken";
const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(token) {
            let decodedData = jwt.verify(token, "jwt123");
            req.userId = decodedData?.id;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authentication;