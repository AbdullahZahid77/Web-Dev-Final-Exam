import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000', // This should match the backend server's URL
    timeout: 5000,
});


export default apiClient;