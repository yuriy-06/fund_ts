"use strict";
const Interpolation = require("g:/fund_ts/interpolation");
//import {Interpolation} from "g:/fund_ts/interpolation";
const Outflanking = require("g:/fund_ts/fund");
describe("здесь мы проверяем модуль Interpolation", () => {
	it("Проверим меод index", () => {
		let m = [0, 1, 2, 3, 4, 5], p = 2.1;
		let index = Interpolation.Interpolation.index(m,p);
		expect(index).toBe(2);
	});
	
	
});