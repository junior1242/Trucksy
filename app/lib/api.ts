import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";

export function useAPI() {
  const { getToken } = useAuth();
  const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_BASE_URL });
  api.interceptors.request.use(async (cfg) => {
    const token = await getToken();
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  });
  return api;
}