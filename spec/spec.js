"use strict";
const Interpolation = require("../interpolation");
//import {Interpolation} from "g:/fund_ts/interpolation";
const Outflanking = require("../fund");

describe("здесь мы проверяем модуль Interpolation", () => {

	it("Проверим метод index", () => {
		let m = [0, 1, 2, 3, 4, 5], p = 2.1;
		let index = Interpolation.Interpolation.index(m,p);
		expect(index).toBe(2);
	});
	
	it("Проверим метод int1d", () => {
		let m = [2.1, 3, 2.6, 3.5], x = 2.25;
		let val = parseFloat(Interpolation.Interpolation.int1d(m,x).toFixed(3));
		expect(val).toBe(3.15);
	});

	it("Проверим метод int2d", () => {
		let alfa_etta_ksi_m = [[0.96, 0.972, 0.975, 0.976, 0.977, 0.977],
							[0.8, 0.848, 0.866, 0.876, 0.879, 0.881]],
	
    	ksi_m = [0.4, 0.8],
    	etta_m = [1.0, 1.4, 1.8, 2.4, 3.2, 5];
		let val = parseFloat(Interpolation.Interpolation.int2d(alfa_etta_ksi_m, etta_m, ksi_m, 1.5, 0.45).toFixed(3));
		expect(val).toBe(0.958);
	});

});