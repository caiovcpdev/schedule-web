// api/authHttp.ts
import axios from "axios";

export const authHttp = axios.create({
    baseURL: "https://localhost:7235",
    headers: {
        "Content-Type": "application/json",
    },
});