import axios from "axios";

import IGetRequest from "../src/models/IGetRequest";
import IPostRequest from "../src/models/IPostRequest";
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

        const request: IGetRequest = {
            method: "get",
            path: ""
        };

        requestSender.send([request]);

        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledTimes(0);
    });

    it("should send post request", () => {
        const requestSender = new RequestSender();

        const mockGet = jest.fn().mockResolvedValue(true);
        axios.get = mockGet;
        const mockPost = jest.fn().mockResolvedValue(true);
        axios.post = mockPost;

        const request: IPostRequest = {
            method: "post",
            body: "",
            path: ""
        };

        requestSender.send([request]);

        expect(mockGet).toHaveBeenCalledTimes(0);
        expect(mockPost).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
        jest.unmock("axios");
    });
});
