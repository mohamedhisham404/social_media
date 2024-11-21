import jwt from 'jsonwebtoken';

const generateJWT = async (payload) => {
    const token = await jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn:'10h'}
    );    

    return token;
}

export { generateJWT };