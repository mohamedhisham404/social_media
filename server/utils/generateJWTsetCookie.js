import jwt from 'jsonwebtoken';

const generateJWTsetCookie = async (userId ,res) => {
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn:'15d'}
    );  
    
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 15 * 60 * 60 * 24 * 15,
        sameSite:"strict"
    });

    return token;
}

export default generateJWTsetCookie;