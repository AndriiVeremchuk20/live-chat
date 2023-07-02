import axios from "axios";

const BASE_URL = "http://localhost:5000/";

const client = axios.create({
  baseURL: BASE_URL,
  //add "instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;"
});

export default client;
