import { validateEvent } from "./validateEvent";

module.exports = {
    validateRawEvent: (event: Buffer): boolean => true,
    validateEvent: validateEvent
};

// validateEvent({event: "SET_WARP"});
