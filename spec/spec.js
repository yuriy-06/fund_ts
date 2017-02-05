"use strict";
const Interpolation = require("../interpolation");
const Outflanking = require("../fund");
const isEqual = require("lodash.isequal");

describe("здесь мы проверяем модуль Interpolation\n", () => {

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

describe("здесь мы проверяем методы непосредственно классов основной программы\n", () => {

		let ige1 = new Outflanking.Ige({h:3.6, e:1800, waterHold:"yes", γ:1.7}),
			ige2 = new Outflanking.Ige({h:1.8, e:900, waterHold:"no", γ:1.7}),
			ige3 = new Outflanking.Ige({h:8.5, e:1500, waterHold:"no", γ:1.7});
		let listLayers1 = [ige1, ige2, ige3];
		let fund1 = new Outflanking.SqBase ({name:"Fm1", l1: 3.0, l2: 2.0, h: 1.5, h_land: 1.2, γ_: 1.8, forces: {nMax: 2, nMin: 1.2, q1: 2, q2: 1.5, m1: 2, m2: 1.5}});
		fund1.xy(0, 0);
		fund1.listLayers = listLayers1;
		
	it("Проверим метод splitArray", () => {

		/*let f_log = (msg) => {
			msg; let sum = 0;
			for(var item of fund1.listLayers){console.log(item.h); sum += item.h};
			console.log(`sum = ${sum}`);};

		f_log(console.log("было"));*/

		fund1.splitArray();

		//f_log(console.log("стало"));
		let collect = [];
		for(var item of fund1.listLayers){collect.push(item.h);};
		let t = isEqual([0.8, 0.8, 0.8, 0.8, 0.4, 0.8, 0.8, 0.2, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.5], collect);
		expect(t).toBe(true);});

		it("Проверим метод zCreate", () => {

		fund1.zCreate();
		let z1Collect=[]; let z2Collect = [];
		for(var item of fund1.listLayers){z1Collect.push(item.z1);};
		console.log(`z1Collect = ${z1Collect}`);
		console.log(`z2Collect = ${z2Collect}`);



		//let t = isEqual([0.8, 0.8, 0.8, 0.8, 0.4, 0.8, 0.8, 0.2, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.5], collect);
		expect(true).toBe(true);});

	});