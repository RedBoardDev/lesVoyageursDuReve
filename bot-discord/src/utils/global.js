import { readFile } from 'fs/promises';
import * as log from 'nodejs-log-utils';

export async function loadConfigJson() {
    return JSON.parse(await readFile(new URL('../../config.json', import.meta.url)));
}

export async function sendError(errorObj) {
    log.error(errorObj.message, true, true);
    log.debug(JSON.stringify(errorObj, null, 4), false, true);
}
