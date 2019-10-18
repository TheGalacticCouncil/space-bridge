import EStation from "../src/models/EStation";

import EventHandler from "../src/eventHandler";
import * as requestCreator from "../src/requestCreator";

const ACTIVATE_SELF_DESTRUCT = "ACTIVATE_SELF_DESTRUCT";
const CANCEL_SELF_DESTRUCT = "CANCEL_SELF_DESTRUCT";
const CONFIRM_SELF_DESTRUCT = "CONFIRM_SELF_DESTRUCT";
const REVOKE_SELF_DESTRUCT = "REVOKE_CONFIRM_SELF_DESTRUCT";

describe("EventHandler", () => {

    let handler;

    beforeEach(() => {

        handler = new EventHandler();

        handler.stations = [
            EStation.ENGINEER,
            EStation.WEAPONS,
            EStation.HELM,
            EStation.SCIENCE,
            EStation.RELAY
        ];

        handler.initializeSelfDestructConfirmations();
    });

    describe("activateSelfDestruct", () => {

        it("should activate self destruct, confirm Engineer station and return correct requests", () => {

            expect(handler.selfDestructActive).toBe(false);

            const activateMessage = {
                event: ACTIVATE_SELF_DESTRUCT,
                station: EStation.ENGINEER
            };

            const expectedRequests = [requestCreator.activateSelfDestruct()];
            const returnedRequests = handler.handleEvent(activateMessage);

            expect(handler.selfDestructActive).toBe(true);
            expect(handler.selfDestructConfirmations[EStation.ENGINEER]).toBe(true);
            expect(returnedRequests).toEqual(expectedRequests);
        });

        it("should not change state and return [] when sending station is not Engineer", () => {

            expect(handler.selfDestructActive).toBe(false);

            const activateMessage = {
                event: ACTIVATE_SELF_DESTRUCT,
                station: "SCIENCE"
            };

            const returnedRequests = handler.handleEvent(activateMessage);
            const expectedRequests = [];

            expect(handler.selfDestructActive).toBe(false);
            expect(returnedRequests).toEqual(expectedRequests);
        });
    });

    describe("cancelSelfDestruct", () => {

        it("should disable self destruct, clear confirmations and return correct requests", () => {

            const deactivateMessage = {
                event: CANCEL_SELF_DESTRUCT,
                station: EStation.ENGINEER
            };

            const confirmedStations = {
                ENGINEER: true,
                WEAPONS: true,
                HELM: true,
                SCIENCE: true,
                RELAY: true
            };

            const expectedConfirmations = {
                ENGINEER: false,
                WEAPONS: false,
                HELM: false,
                SCIENCE: false,
                RELAY: false
            };

            const expectedRequests = [requestCreator.cancelSelfDestruct()];

            handler.selfDestructActive = true;
            handler.selfDestructConfirmations = confirmedStations;

            const returnedRequests = handler.handleEvent(deactivateMessage);

            expect(handler.selfDestructActive).toBe(false);
            expect(handler.selfDestructConfirmations).toEqual(expectedConfirmations);
            expect(returnedRequests).toEqual(expectedRequests);
        });

        it("should return false and do nothing else when sending station is not Engineer", () => {

            const deactivateMessage = {
                event: CANCEL_SELF_DESTRUCT,
                station: EStation.WEAPONS
            };

            const confirmedStations = {
                ENGINEER: true,
                WEAPONS: true,
                HELM: true,
                SCIENCE: true,
                RELAY: true
            };

            const expectedConfirmations = {
                ENGINEER: true,
                WEAPONS: true,
                HELM: true,
                SCIENCE: true,
                RELAY: true
            };

            const expectedRequests = [];

            handler.selfDestructActive = true;
            handler.selfDestructConfirmations = confirmedStations;

            const returnedRequests = handler.handleEvent(deactivateMessage);

            expect(handler.selfDestructActive).toBe(true);
            expect(handler.selfDestructConfirmations).toEqual(expectedConfirmations);
            expect(returnedRequests).toEqual(expectedRequests);
        });
    });

    describe("confirmSelfDestruct", () => {

        it("should accept self destruct confirmations when active", () => {

            handler.selfDestructActive = true;

            const confirmMessage = {
                event: CONFIRM_SELF_DESTRUCT,
                station: EStation.WEAPONS
            };

            const noConfirmations = {
                ENGINEER: false,
                WEAPONS: false,
                HELM: false,
                SCIENCE: false,
                RELAY: false
            };

            const weaponsConfirmed = {
                ENGINEER: false,
                WEAPONS: true,
                HELM: false,
                SCIENCE: false,
                RELAY: false
            };

            expect(handler.selfDestructConfirmations).toEqual(noConfirmations)

            handler.handleEvent(confirmMessage);

            expect(handler.selfDestructConfirmations).toEqual(weaponsConfirmed);
        });

        it("should not accept self destruct confirmations when inactive", () => {

            expect(handler.selfDestructActive).toBe(false);

            const confirmMessageWeapons = {
                event: CONFIRM_SELF_DESTRUCT,
                station: EStation.WEAPONS
            };

            const confirmMessageEngineer = {
                event: CONFIRM_SELF_DESTRUCT,
                station: EStation.ENGINEER
            };

            const noConfirmations = {
                ENGINEER: false,
                WEAPONS: false,
                HELM: false,
                SCIENCE: false,
                RELAY: false
            };

            expect(handler.selfDestructConfirmations).toEqual(noConfirmations)

            handler.handleEvent(confirmMessageWeapons);
            handler.handleEvent(confirmMessageEngineer);

            expect(handler.selfDestructConfirmations).toEqual(noConfirmations);
        });

        it("should only send self destruct when all stations have confirmed", () => {

            const confirmMessageWeapons = {
                event: CONFIRM_SELF_DESTRUCT,
                station: EStation.WEAPONS
            };

            const confirmMessageEngineer = {
                event: CONFIRM_SELF_DESTRUCT,
                station: EStation.ENGINEER
            };

            const confirmMessageHelm = {
                event: CONFIRM_SELF_DESTRUCT,
                station: EStation.HELM
            };

            const confirmMessageScience = {
                event: CONFIRM_SELF_DESTRUCT,
                station: EStation.SCIENCE
            };

            const confirmMessageRelay = {
                event: CONFIRM_SELF_DESTRUCT,
                station: EStation.RELAY
            };

            const expectedRequests = [requestCreator.confirmSelfDestruct()];

            handler.selfDestructActive = true;
            handler.handleEvent(confirmMessageWeapons);
            handler.handleEvent(confirmMessageEngineer);
            handler.handleEvent(confirmMessageHelm);
            handler.handleEvent(confirmMessageScience);

            const returnedRequests = handler.handleEvent(confirmMessageRelay);

            expect(returnedRequests).toEqual(expectedRequests);
        });
    });

    describe("revokeSelfDestruct", () => {

        it("should revoke self destruct confirmation of sending station", () => {

            handler.selfDestructActive = true;

            const revokeMessage = {
                event: REVOKE_SELF_DESTRUCT,
                station: EStation.WEAPONS
            };

            const noConfirmations = {
                ENGINEER: false,
                WEAPONS: false,
                HELM: false,
                SCIENCE: false,
                RELAY: false
            };

            const weaponsConfirmed = {
                ENGINEER: false,
                WEAPONS: true,
                HELM: false,
                SCIENCE: false,
                RELAY: false
            };

            handler.selfDestructConfirmations = weaponsConfirmed;
            handler.handleEvent(revokeMessage);

            expect(handler.selfDestructConfirmations).toEqual(noConfirmations);
        });
    });
});
