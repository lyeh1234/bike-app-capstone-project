import axios from 'axios';

const BASE_URL = 'http://localhost:8080'

export default class Auth {
    setAuthorizationToken(token) {
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
    }
    
    signup(userData) {
          return axios.post(`${BASE_URL}/api/users`, userData);
    }
    
    logout() {
        localStorage.removeItem('jwtToken');
        this.setAuthorizationToken(false);
    }
    
    login(data) {
        return axios.post(`${BASE_URL}/api/users/auth`, data).then(res => {
        const token = res.data;
        localStorage.setItem('jwtToken', token);
        this.setAuthorizationToken(token);
        });
    }
}
