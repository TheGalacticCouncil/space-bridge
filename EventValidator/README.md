EventValidator
==============

EventValidator validates received event.

Usage
-----

npm start
npm link

change to project where you would like to use EventValidator and run
npm link event-validator

Then in code you can use 
import validator from "event-validator";

And the only function provided is:
validator.validateEvent<T>(event<T>): Promise<T>

Where <T> is Event object to be validated. Resolves to the validated object or rejects if provided object is not a valid
 event.
