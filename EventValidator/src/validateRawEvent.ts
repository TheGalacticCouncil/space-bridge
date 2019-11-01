import { validateEvent } from "./validateEvent";

export function validateRawEvent<T>(rawEvent: Buffer): Promise<T> {
    try {
        const event = JSON.parse(rawEvent.toString());

        return validateEvent(event);

    } catch (e) {
        return Promise.reject("Given event is malformed!");
    }
}
