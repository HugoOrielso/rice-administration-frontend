import axios from "axios";

export const axiosClientPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
}); 

export default axiosClientPublic;


