
import axios from 'axios';
import Cookies from 'js-cookie';

export function createSession(token){
    const expiresAt = new Date(Date.now() +  1 * 24 * 60 * 60 * 1000);
    Cookies.set('session', token, {
        expires: expiresAt,
        secure: true,
        sameSite: 'lax',
        path: '/',
    })
}

export async function getSession(){
    // console.log('Getting session 1');
    const session = Cookies.get('session');
    if(!session){
        return null;
    }
    // console.log("session:",session);
    const response = await axios.get('http://localhost:5000/v1/external/verify', {
        headers: {
            authorization: `Bearer ${session}`
        }
    })
    // console.log('response:',response.data.success);
    return response.data.success
}

export function getTokens(){
    const token = Cookies.get('session');
    if(!token){
        return null;
    }
    return token;
}