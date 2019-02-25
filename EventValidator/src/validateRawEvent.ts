import { validateEvent } from "./validateEvent";

export function validateRawEvent<T>(rawEvent: Buffer): Promise<T> {
    try {
        const event = JSON.parse(rawEvent.toString());

        return validateEvent(event);

    } catch (e) {
        throw new Error("Given event is malformed!");
    }
}
