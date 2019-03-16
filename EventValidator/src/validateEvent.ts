import _ from "lodash";
import Joi from "joi";
import events from "../events.json";

const stations = [
    "HELM",
    "WEAPONS",
    "ENGINEER",
    "SCIENCE",
    "RELAY"
];

// TODO: Define generic event schema instead of any
export function validateEvent<T>(event: T): Promise<T> {

    // Get event type
    const eventName = _.get(event, "event");

    if (_.isUndefined(eventName)) {
        throw new Error("Invalid event!");
    }

    // Find event with correct name
    const eventDefinition = _.find(events, (eventDefinition: any): boolean => {
        return eventDefinition.name == eventName;
    }) as any;

    if (_.isUndefined(eventDefinition)) {
        throw new Error("Invalid event!");
    }

    // create schema to verify event against
    const schemaBase = {
        timestamp: Joi.number().required(),
        sourceComponent: Joi.string().required(),
        sourceIp: Joi.string().ip({
            version: ["ipv4"],
            cidr: "forbidden"
        }),
        event: Joi.string().equal(eventName),
        station: Joi.string().valid(stations)
    };

    const payloadSchema = {};

    // Iterate through defined fields
    if (!_.isEmpty(eventDefinition.fields)) {
        _.forEach(eventDefinition.fields, field => {

            let fieldToAdd;

            if (field.datatype === "int") {
                const maxValue = _.get(field, "max", Number.MAX_SAFE_INTEGER);
                const minValue = _.get(field, "min", Number.MIN_SAFE_INTEGER);

                 fieldToAdd = Joi.number().integer().max(maxValue).min(minValue);

            } else if (field.datatype === "string") {
                if (_.has(field, "possibleValues")) {
                    fieldToAdd = Joi.string().valid(field.possibleValues);

                } else {
                    fieldToAdd = Joi.string();
                }

            } else if (field.datatype === "SPACEUNIT") {
                fieldToAdd = Joi.number();
            }

            if (!_.isUndefined(fieldToAdd)) {
                if (_.get(field, "optional", false)) {
                    payloadSchema[field.name] = fieldToAdd;
                } else {
                    payloadSchema[field.name] = fieldToAdd.required();
                }
            }
        });
    }

    schemaBase["payload"] = Joi.object().keys(payloadSchema);

    const eventSchema = Joi.object().keys(schemaBase);

    // Verify event agains schema
    return Joi.validate(event, eventSchema)
        .then(value => value)
        .catch(err => {
            // TODO: Should we log here or what?

            throw new Error(err);
        });
}

export default validateEvent;
