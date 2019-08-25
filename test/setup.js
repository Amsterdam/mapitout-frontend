/* eslint-env jest */
// eslint-disable-next-line no-undef
global.fetch = require("jest-fetch-mock");

const TIMEOUT = 1000;

jest.setTimeout(TIMEOUT);
