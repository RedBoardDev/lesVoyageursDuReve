import axios from 'axios';

export async function executeDBRequest(method, endpoint, token = "", body = {}) {
    return axios({
        method: method,
        url: process.env.API_URL + endpoint,
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

export async function getEvent(id) {
    return new Promise((resolve) => {
        executeDBRequest('GET', `/event/${id}`, process.env.API_TOKEN).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            resolve(undefined);
        });
    });
}

export async function getEvents() {
    return new Promise((resolve) => {
        executeDBRequest('GET', `/event/all`, process.env.API_TOKEN).then((res) => {
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
            resolve(undefined);
        });
    });
}

export async function getEventTypeColor(event) {
    if (event.game_type_id === -1) {
        return '#000000';
    } else {
        return (await getEventType(event.game_type_id)).color;
    }
}

export async function getEventTypeName(lastEvent) {
    if (lastEvent.game_type_id === -1) {
        return lastEvent.game_type_custom;
    } else {
        return (await getEventType(lastEvent.game_type_id)).name;
    }
}
