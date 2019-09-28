import axios from "axios";

import {RequestSender} from "../src/requestSender";

describe("RequestSender", () => {

    beforeAll(() => {

        jest.mock("axios");
    });

    it("should send get request", () => {
        const requestSender = new RequestSender();

        const mockGet = jest.fn().mockResolvedValue(true);
        axios.get = mockGet;
        const mockPost = jest.fn().mockResolvedValue(true);
        axios.post = mockPost;

        const request = {
            method: "get"
        };

        requestSender.send(request);

        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledTimes(0);
    });

    it("should send post request", () => {
        const requestSender = new RequestSender();

        const mockGet = jest.fn().mockResolvedValue(true);
        axios.get = mockGet;
        const mockPost = jest.fn().mockResolvedValue(true);
        axios.post = mockPost;

        const request = {
            method: "post"
        };

        requestSender.send(request);

        expect(mockGet).toHaveBeenCalledTimes(0);
        expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it("should not send invalid request", () => {
        const requestSender = new RequestSender();

        const mockGet = jest.fn().mockResolvedValue(true);
        axios.get = mockGet;
        const mockPost = jest.fn().mockResolvedValue(true);
        axios.post = mockPost;

        const request = {
            method: "invalid"
        };

        requestSender.send(request);

        expect(mockGet).toHaveBeenCalledTimes(0);
        expect(mockPost).toHaveBeenCalledTimes(0);
    });

    afterAll(() => {
        jest.unmock("axios");
    });
});
