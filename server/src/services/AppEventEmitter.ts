import EventEmitter from "events";

export default class AppEventEmitter extends EventEmitter {}

export const appEventEmitter = new AppEventEmitter();
