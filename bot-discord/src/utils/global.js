import { readFile, writeFile } from 'fs/promises';
import * as log from 'nodejs-log-utils';

// export async function loadConfigJson() {
//     return JSON.parse(await readFile(new URL('../../config.json', import.meta.url)));
// }

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
