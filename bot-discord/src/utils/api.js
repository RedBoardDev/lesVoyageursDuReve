import axios from 'axios';
import { loadConfigJson } from '../utils/global.js';

const config = await loadConfigJson();

export async function executeDBRequest(method, endpoint, token = "", body = {}) {
    return axios({
        method: method,
        url: config.api_url + endpoint,
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        data: body
    });
}

export async function getEventType(id) {
    return new Promise((resolve) => {
        executeDBRequest('GET', `/game/type/${id}`, process.env.API_TOKEN).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            resolve(undefined);
        });
    });
}

export async function getUser(id) {
    return new Promise((resolve) => {
        executeDBRequest('GET', `/user/id/${id}`, process.env.API_TOKEN).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            console.log(err);
            resolve(undefined);
        });
    });
}
