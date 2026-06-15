import axios from "axios";

const http = axios.create({
  baseURL: "https://blog-api-t6u0.onrender.com/posts",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default http;