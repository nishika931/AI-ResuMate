import axios from 'axios';

const instance=axios.create({
    baseURL: "ttp://localhost:4000"
})

export default instance;