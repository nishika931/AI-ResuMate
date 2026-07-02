import axios from 'axios';

const instance=axios.create({
    baseURL: "https://ai-resumate.onrender.com"
})

export default instance;