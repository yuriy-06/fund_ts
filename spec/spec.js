"use strict";
const Interpolation = require("../interpolation");
const Outflanking = require("../fund");
const isEqual = require("lodash.isequal");
/*var fs = require('fs');
var stream = fs.createWriteStream("alfa.txt");*/

function mEqual(m1, m2){
	let len = m1.length;
	if (len != m2.length){return false;};
	for(var i =0; i < len; i++){
		if (m1[i] - m2[i] > 0.001){return false;};
		};
		return true;
	};

describe("здесь мы проверяем модуль Interpolation\n", () => {

	it("Проверим метод index", () => {
		let m = [0, 1, 2, 3, 4, 5], p = 2.1;
		let index = Interpolation.Interpolation.index(m,p);
		expect(index).toBe(2);
	});

	it("проверим выход за пределы масива индекса", () => {

		let m = [0, 1, 2, 3, 4, 5], p = 5.1;
		let index = Interpolation.Interpolation.index(m,p);
		expect(index).toBe(5);

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
			for(var item of fund1.listLayers){z1Collect.push(parseFloat(item.z1.toFixed(3)));};
			for(var item of fund1.listLayers){z2Collect.push(parseFloat(item.z2.toFixed(3)));};
			let eCollect = [];
			for(var item of fund1.listLayers){eCollect.push(item.e);};
			//console.log(`eCollect = ${eCollect}`);
			//console.log(`z1Collect = ${z1Collect}`);
			//console.log(`z2Collect = ${z2Collect}`);

			let z1 = isEqual([0, 0.8, 1.6, 2.4, 3.2, 3.6, 4.4, 5.2, 5.4, 6.2, 7, 7.8, 8.6, 9.4, 10.2, 11, 11.8, 12.6, 13.4], z1Collect);
			let z2 = isEqual([0.8, 1.6, 2.4, 3.2, 3.6, 4.4, 5.2, 5.4, 6.2, 7, 7.8, 8.6, 9.4, 10.2, 11, 11.8, 12.6, 13.4, 13.9], z2Collect);
			expect(true).toBe(z1);
			expect(true).toBe(z2);

		});

		it("проверим метод σ_eval", ()=> {

			expect(2.493).toBe(parseFloat(fund1.p.toFixed(3)));
			expect(2.16).toBe(fund1.σ_zg0);
			// распечатаем к-ты альфа
			//console.log(" распечатаем к-ты альфа ");
			let alfa_m = [];
			for(var item of [0.8, 1.6, 2.4, 3.2, 3.6, 4.4, 5.2, 5.4, 6.2, 7, 7.8, 8.6, 9.4, 10.2, 11, 11.8, 12.6, 13.4, 13.9])
			//for(var item of [12.1])
				{
				let a = Interpolation.Interpolation.int2d(fund1.listLayers[0].alfa_etta_ksi_m, fund1.listLayers[0].etta_m, fund1.listLayers[0].ksi_m, 1.5, item);
				//console.log(a);
				alfa_m.push(a);
				//stream.write(Interpolation.Interpolation.int2d(fund1.listLayers[0].alfa_etta_ksi_m, fund1.listLayers[0].etta_m, fund1.listLayers[0].ksi_m, 1.5, item).toString());

				};
				//stream.end();
			let val1 = mEqual(alfa_m, [0.8525, 0.5435, 0.3372, 0.2202, 0.1820, 0.1298, 0.0965, 0.0902, 0.0700, 0.0554, 0.0449, 0.0372, 0.0315, 0.0268, 0.0231, 0.0202, 0.0162, 0.0122, 0.0098]);
			expect(true).toBe(val1);
			fund1.σ_eval();
			let σ_zpi_m = [], σ_zpi4_m = [], σ_z_gamma_i_m = [], σzg_m=[], u_m=[];
			for (var item of fund1.listLayers){
				σ_zpi_m.push(item.σ_zpi); σ_zpi4_m.push(item.σ_zpi4); σ_z_gamma_i_m.push(item.σ_zgi); σzg_m.push(item.σzg); u_m.push(item.u);

			};
			let val2 = mEqual([2.125, 1.355, 0.841, 0.549, 0.454, 0.324, 0.241, 0.225, 0.175, 0.138, 0.112, 0.093, 0.079, 0.067, 0.058, 0.050, 0.040, 0.030, 0.024], σ_zpi_m);
			});

		it("проверим метод hc_eval", ()=> {

			
		});

		it("проверим метод hc_7_method", ()=> {

			
		});

		it("проверим метод hc_eval_7", ()=> {

			
		});

		it("проверим метод osadka_eval", ()=> {

			
		});
		
		it("проверим метод osadka_add", ()=> {

			
		});


	});