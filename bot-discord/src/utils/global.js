import { writeFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import * as log from 'nodejs-log-utils';

try {
    JSON.parse(await readFile(new URL('../../data.json', import.meta.url)));
} catch (e) {
    writeFileSync(new URL('../../data.json', import.meta.url), "{\"lastEventSent\": 0}", { flag: "w" });
}

export async function loadDataJson() {
    return JSON.parse(await readFile(new URL('../../data.json', import.meta.url)));
}

export async function writeDataJson(data) {
    await writeFile(new URL('../../data.json', import.meta.url), JSON.stringify(data, null, 4));
}

export async function sendError(errorObj) {
    log.error(errorObj.message, true, true);
    log.debug(JSON.stringify(errorObj, null, 4), false, true);
}
