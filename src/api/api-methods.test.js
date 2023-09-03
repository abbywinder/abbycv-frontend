import { getData, postData } from "./api-methods";
import { makeServer } from '../utils/testServer';

let server;

beforeAll(() => {
  server = makeServer({ environment: 'test' });
});

afterAll(() => {
  server.shutdown();
});

it("Get request can reach the server", async () => {
    const endpoint = '/api/lifestages';
    const response = await getData(endpoint);

    expect(response).toEqual({"lifestages": [{"id": "1", "title": "Lifestage 1"}, {"id": "2", "title": "Lifestage 2"}]});
});

it("Get request returns empty array if 404", async () => {
    const endpoint = '/api/not-found';
    const response = await getData(endpoint);

    expect(response).toEqual([]);
});

it("Get request returns error text if 500", async () => {
    const endpoint = '/api/error';
    const response = await getData(endpoint);

    expect(response).toBeNull();
});

it("Post request can reach the server", async () => {
    const endpoint = '/api/lifestages';
    const response = await postData(endpoint, {title: 'Lifestage 3'});

    expect(response).toEqual({"lifestage": {"id": "3", "title": "Lifestage 3"}});
});

it("Post request returns empty array if 404", async () => {
    const endpoint = '/api/not-found';
    const response = await postData(endpoint, {title: 'Lifestage 3'});

    expect(response).toEqual([]);
});

it("Post request returns error text if 500", async () => {
    const endpoint = '/api/error';
    const response = await postData(endpoint, {title: 'Lifestage 3'});

    expect(response).toBeNull();
});