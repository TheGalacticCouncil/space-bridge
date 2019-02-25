import { validateEvent } from "./validateEvent";
import { validateRawEvent } from "./validateRawEvent";

module.exports = {
    validateRawEvent: validateRawEvent,
    validateEvent: validateEvent
};

// validateEvent({event: "SET_WARP"});
