import {Interpolation} from './interpolation'
import * as _ from "lodash.times/index"
interface HasIge{
	h:number;
	e: number;
	ei?: number;
	γ:number;
	γ_s?:number;
	waterHold?:string;
	e_por?:number;
}

export class Ige {
	name: string;
	h:number;
	z1:number;
	z2:number;
	waterHold: string;
	γ:number;
	γ_s:number;
	s: number;
	σ_zpi: number;
	σ_zpi4: number; // напряжение в угловой точку фундамента (напряжение влияющего фундамента)
	σzg: number;
	e: number;
	ei: number;
	σ_zgi: number;
	s_add: number;
	s_all: number;
	e_por: number;
	u: number; // давление воды
	alfa_etta_ksi_m = [
	[1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
	[0.96, 0.972, 0.975, 0.976, 0.977, 0.977],
	[0.8, 0.848, 0.866, 0.876, 0.879, 0.881],
	[0.606, 0.682, 0.717, 0.739, 0.749, 0.754],
	[0.449, 0.532, 0.578, 0.612, 0.629, 0.639],
	[0.336, 0.414, 0.463, 0.505, 0.53, 0.545],
	[0.257, 0.325, 0.374, 0.419, 0.449, 0.47],
	[0.201, 0.26, 0.304, 0.349, 0.383, 0.41],
	[0.16, 0.21, 0.251, 0.294, 0.329, 0.36],
	[0.131, 0.173, 0.209, 0.25, 0.285, 0.319],
	[0.108, 0.145, 0.176, 0.214, 0.248, 0.285],
	[0.091, 0.123, 0.15, 0.185, 0.218, 0.255],
	[0.077, 0.105, 0.13, 0.161, 0.192, 0.23],
	[0.067, 0.091, 0.113, 0.141, 0.17, 0.208],
	[0.058, 0.079, 0.099, 0.124, 0.152, 0.189],
	[0.051, 0.07, 0.087, 0.11, 0.136, 0.173],
	[0.045, 0.062, 0.077, 0.099, 0.122, 0.158],
	[0.04, 0.055, 0.069, 0.088, 0.11, 0.145],
	[0.036, 0.049, 0.062, 0.08, 0.1, 0.133],
	[0.032, 0.044, 0.056, 0.072, 0.091, 0.123],
	[0.029, 0.04, 0.051, 0.066, 0.084, 0.113],
	[0.026, 0.037, 0.046, 0.06, 0.077, 0.105],
	[0.024, 0.033, 0.042, 0.055, 0.071, 0.098],
	[0.022, 0.031, 0.039, 0.051, 0.065, 0.091],
	[0.02, 0.028, 0.036, 0.047, 0.06, 0.085],
	[0.019, 0.026, 0.033, 0.043, 0.056, 0.079],
	[0.017, 0.024, 0.031, 0.04, 0.052, 0.074],
	[0.016, 0.022, 0.029, 0.037, 0.049, 0.069],
	[0.015, 0.021, 0.027, 0.035, 0.045, 0.065],
	[0.014, 0.02, 0.025, 0.033, 0.042, 0.061],
	[0.013, 0.018, 0.023, 0.031, 0.04, 0.058]];
    ksi_m = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.4, 4.8, 5.2, 5.6, 6.0, 6.4, 6.8, 7.2, 7.6, 8.0, 8.4, 8.8, 9.2, 9.6, 10.0, 10.4, 10.8, 11.2, 11.6, 12.0];
    etta_m = [1.0, 1.4, 1.8, 2.4, 3.2, 5];
	constructor(obj: HasIge)
	{
		this.e = obj.e;
		this.ei = obj.ei||5*this.e;
		this.h = obj.h;
		this.γ = obj.γ;
		this.γ_s = obj.γ_s||2.7;
		this.waterHold = obj.waterHold;
		this.e_por = obj.e_por||0.8;
	}
	newh(h:number){
		this.h = h;
		return this;
	}
	σ_zpi_method(p:number, b:number, etta:number){
		let ksi = 2*this.z2/b;
		if (ksi > 12) {ksi = 12; console.log("warning, in z = ${this.z2}, ksi > 12 (${2*this.z2/b})")};
		let a = Interpolation.int2d(this.alfa_etta_ksi_m, this.etta_m, this.ksi_m, etta, ksi);
		this.σ_zpi = a * p;
		this.σ_zpi4 = this.σ_zpi / 4;
		return this.σ_zpi;
	}
	σ_z_gamma_i(zg0:number, bk:number, etta_k:number){
		let ksi_k = 2*this.z2/bk;
		if (ksi_k > 12) {ksi_k = 12; console.log("warning, in z = ${this.z2}, ksi_k > 12 (${2*this.z2/bk})")};
		let a = Interpolation.int2d(this.alfa_etta_ksi_m, this.etta_m, this.ksi_m, etta_k, ksi_k);
		this.σ_zgi = a * zg0;
		return this.σ_zgi;
	}
	σ_gi(prevWaterPress:number, prev_σzg:number) // ну и как насчет юникода?
	{
		if (this.waterHold == "yes" || this.waterHold == "Yes" || this.waterHold == "YES" || this.waterHold == "y" || this.waterHold == "Y") 
		{
			this.u = prevWaterPress + this.h;
			let γw = 1;
			let γsb = (this.γ_s - γw) / (1 + this.e_por)
			this.σzg = prev_σzg + γsb * this.h - this.u}
		else
			// текущее давление воды остается нулем, как и было
			{this.σzg = prev_σzg + this.γ * this.h};
		//ρw = 1 # плотность воды
		//g = 10 #ускорение силы тяжести, м/сек2
		//u = ρw * g * z_wi
		// z_wi - глубина залегания уровня i–го слоя грунта от положения уровня грунтовых вод
		return [this.σzg, this.u];
	}
}

interface HasForces{
	nMax: number;
	nMin: number;
	q1: number;
	q2: number;
	m1: number;
	m2: number;
}
interface HasSqBase{
	name: string;
	l1: number;
	l2: number;
	h: number;
	h_land: number;
	forces: HasForces;
	γ_?: number; // плотность засыпки
	l_k?: number;
	b_k?: number;
	level?: number;
}
export class Point{
	x: number;
	y: number;
	constructor(obj){
		this.x = obj.x; this.y = obj.y;
	}
	xtoy(){
		let z = this.x;
		this.x = this.y;
		this.y = z;
	}
}
export class SqBase {
	name: string;
	x: number = 0;
	y: number = 0;
	l1: number;
	l2: number;
	l: number;
	b: number;
	h: number;
	b_k: number;
	l_k: number;
	etta: number;
	etta_k: number;
	h_land:number;
	forces: HasForces;
	γ_: number; // плотность засыпки
	listLayers: Ige[];  // слои начинают отсчитываться от подошвы фундамента, потом можно написать код, пересчитывающий в отметку уровня планировки
	b_sect: number; // число для разрезки грунтов
	p: number;
	σ_zg0: number;
	hc: any = false;
	hc_7: number;
	hMin: number; // минимальная глубина сжимаемой толщи
	sign: string; // знак напряжений от влияемого фундамента
	fund_affecting: SqBase; // поле для влияющего фундамента
	level: number; // отметка подошвы фундамента
	plist: {p1:Point, p2:Point, p3:Point, p4:Point};// условные оординаты влияющего фундамента
	constructor(obj: HasSqBase){
		this.l1 = obj.l1; this.l2 = obj.l2; this.h = obj.h; this.h_land = obj.h_land;this.name = obj.name;
		this.forces = obj.forces;
		this.γ_ = obj.γ_||1.8;
		this.b = Math.min(this.l1,this.l2);
		this.b_sect = 0.4 * this.b;
		this.l = Math.max(this.l1,this.l2);
		let a = this.l * this.b;
		this.p = this.forces.nMax / a + this.γ_ * this.h_land // очень примерно вес считается
		this.σ_zg0 = this.γ_ * this.h_land;
		this.b_k = obj.b_k || this.b + 1;
		this.l_k = obj.l_k || this.l + 1;
		this.etta = this.l / this.b;
		this.etta_k = this.l_k / this.b_k;
		if (this.b <= 10) {this.hMin = this.b/2;};
		if (this.b > 60) {this.hMin = 10;};
		if ((10 < this.b) && (this.b <= 60)) {this.hMin = 4 + 0.1*this.b;};
		this.level = obj.level||0;

	}
	xy(x:number, y:number){
		this.x = x; this.y = y;
	}
	splitArray(){ // дописывается на js
		let listCollect = []; 
		for (var item of this.listLayers){
			console.log(item.h);
			let n = Math.floor(item.h/this.b_sect); // целая часть от деления
			let m = item.h % this.b; // остаток от деления
			_.times(n, ()=> {
				let c = _.clone(item);
				c.h = m;
				listCollect.push(c);
				//# здесь мы копируем слой, изменяя его запись h, и накапливая слои в list_collect
				});
				if (m != 0.0) {let c = _.clone(item); c.h = m; listCollect.push(c);};
		};
		this.listLayers = listCollect;
		return listCollect;
	}
	zCreate(){  // расставляются координаты слоев
		let z1 = 0;
		for(var item of this.listLayers){
			item.z1 = z1; item.z2 = item.z1 + item.h; z1 += item.h;
		}
	}

	σ_eval(){ // расчитываются напряжения в фундаменте
		if (this.etta > 5) {console.log("etta > 5, может считать ленточный фундамент? ")};
		if (this.etta_k > 5) {console.log("etta_k > 5, может считать ленточный фундамент? ")};
		let prevWaterPress = 0;
		let prev_σzg = this.σ_zg0;
		for(var item of this.listLayers){
			item.σ_zpi_method(this.p, this.b, this.etta); item.σ_z_gamma_i(this.σ_zg0, this.b_k, this.etta_k);
			let m = item.σ_gi(prevWaterPress, prev_σzg); 
			prev_σzg = m[0]; prevWaterPress = m[1];
		};
		
	}
	hc_eval(){
        for(var item of this.listLayers)
            {
                if ((item.σ_zpi < (0.5 * item.σzg)) && (item.z2 > this.hMin)) 
                     {this.hc = item.z2; break;};
            };
		if (this.hc == false) {this.hc = " не достигнута"};
		return this.hc;
    }
	hc_7_method(){
		// метод ищет слабый слой с Е < 700 тс/м2 для корректировки сжатой толщи и расчета осадки
		this.hc_7 = 0;
		for (var item of this.listLayers)
		{
			if (item.z2 > this.hc) 
			{
				if (item.e < 700) {this.hc_7 = item.z2;};
			};
		;};
		return this.hc_7;
	}
	hc_eval_7(){
		for (var item of this.listLayers){
			if ((item.σ_zpi < (0.2 * item.σzg)) && (item.z2 > this.hMin)) {this.hc = item.z2; break;};
		};
		return this.hc;
	}
	osadka_eval(s_formula:Function){ // Здесь проверить тип на домашнем ПК // и что такое obj.call()
		for (var item of this.listLayers){
		if (item.z1 < this.hc) 	{item.s = s_formula(item.σ_zpi, item.h, item.e, item.ei, item.σ_zgi)};
		};
	}
	osadka_add(obj_base_add: SqBase){ // в этом месте будет считаться добавочная осадка от влияющего фундамента
		let fund_pull = [],
			dx = Math.abs(obj_base_add.x - this.x),
			dy = Math.abs(obj_base_add.y - this.y);
		// определим условные координаты влияющего фундамента относительно 0 (на который влияют)
		//
		//  p4   p3
		//
		//  p1   p2
		let p1 = new Point({x: dx - (obj_base_add.l/2), y: dy - (obj_base_add.b/2)}),
			p2 = new Point({x: dx + (obj_base_add.l/2), y: dy - (obj_base_add.b/2)}),
			p3 = new Point({x: dx + (obj_base_add.l/2), y: dy + (obj_base_add.b/2)}),
			p4 = new Point({x: dx - (obj_base_add.l/2), y: dy + (obj_base_add.b/2)});
		obj_base_add.plist = {p1: p1, p2: p2, p3: p3, p4: p4};
		//определим размеры и число влияющих фундаментов
		// если какие-нибудь координаты 2 точек будут равны 0 - это будет первый случай, и влияемый фундамент будет разделен на 2
		let fund2procx = function(n1, n2, fund_vl)
			{// f1, f2 - фундаменты на которые делится влияющий
			let f1 = _.clone(fund_vl); let f2 = _.clone(fund_vl);
			f1.l = Math.abs(n1.x); f1.b = Math.abs(n1.y); f1.sign = '+'; // учитываются знаки для влияющих фундаментов
			f2.l = Math.abs(n1.x); f2.b = Math.abs(n2.y); f2.sign = '-';
			return [f1, f2];
			}
		let fund2procxy = function(fund_vl)
			{
			if ((p1.x == 0 ) && (p4.x == 0)) { 
			fund_pull = fund2procx(fund_vl.plist.p3, fund_vl.plist.p1, fund_vl);
			return;};
			if ((p2.x == 0 ) && (p3.x == 0 )) { 
			fund_pull = fund2procx(fund_vl.plist.p4, fund_vl.plist.p1, fund_vl)
			return;};
			};
		fund2procxy(obj_base_add);
		// если фундамент ближе к игриковой оси / зеркалим его по диагонали к Х
		p1.xtoy(); p2.xtoy(); p3.xtoy(); p4.xtoy();
		let z = p1; p1 = p4; p4 = z;
		// повторяем
		fund2procxy(obj_base_add);
		// если 2 случая выше не удовлетворяются значит выполняется третий случай и влияющий фундамент расположен по диогонали (делится на 4 фундамента)
		if ((dx > (obj_base_add.b/2)) &&(dy > (obj_base_add.b/2))) {
			let f1 = _.clone(obj_base_add); f1.l = p3.x; f1.b = p3.y; f1.sign = '+';
			let f2 = _.clone(obj_base_add); f2.l = p4.x; f2.b = p4.y; f2.sign = '-';
			let f3 = _.clone(obj_base_add); f3.l = p2.x; f3.b = p2.y; f3.sign = '-';
			let f4 = _.clone(obj_base_add); f4.l = p1.x; f4.b = p1.y; f4.sign = '+';
			fund_pull = [f1, f2, f3, f4];
		};
		// здесь идет блок кода - расчет добавочных напряжений от влияющих фундаментов и внедрение их в рассматр. фунд.
		// для этого берется фундамент из пула, считаются в нем напряжения в пределах его сжимаемой толщи (в соответствии со знаком)
		// и добавляются в рассматриваемый фундамент
		for(var item of fund_pull){
			item.b_sect = this.b_sect; // здесь учитывается различная разбивка на слои
			item.osadka();
			//чтобы добавить напряжения в рассматриваемый фундамент, надо добавить опред. методы
			// например учесть разность по высоте 
		};
		
	}
	osadka(){ 
		this.splitArray();
		this.zCreate();
		this.σ_eval();
		this.hc_eval();
		this.hc_7_method();
		this.hc_eval_7();
		if (this.p > this.σ_zg0) 
			var s = function(s_zpi:number, h:number, e:number, ei:number, s_zgi:number){ 
				let s = 0.8*(s_zpi - s_zgi)*h/e + 0.8*s_zgi*h/ei;
				return s;
			};
		else
			s = function(s_zpi:number, h:number, e:number){
				let s = 0.8 * s_zpi * h / e ;
				return s;
			};
		this.osadka_eval(s); // посчитали осадку основного фундамента
		
	}
}

export class Outflanking 
{
Main() {
	let ige1 = new Ige({h:3.6, e:1800, waterHold:"yes", γ:1.7}),
		ige2 = new Ige({h:1.8, e:900, waterHold:"no", γ:1.7}),
		ige3 = new Ige({h:8.5, e:1500, waterHold:"no", γ:1.7});
	let l = [1, 2, 3],
		listLayers1 = [ige1, ige2, ige3],
		listLayers2 = [ige1, ige3.newh(5.0), ige2.newh(5.6)];

	// весь упор делаем на интерфейсах (на его минимизации, простоте вызовов) весь функционал Laerse выносим в класс фундаментов
	// класса осадки - тоже
	let fund1 = new SqBase ({name:"Fm1", l1: 3.0, l2: 2.0, h: 1.5, h_land: 1.2, γ_: 1.8, forces: {nMax: 2, nMin: 1.2, q1: 2, q2: 1.5, m1: 2, m2: 1.5}});
	fund1.xy(0, 0);
	let fund2 = new SqBase({name:"Fm2", l1: 3.0, l2: 2.0, h: 1.5, h_land: 1.2, γ_: 1.8, forces: {nMax: 8, nMin: 1.2, q1: 2, q2: 1.5, m1: 2, m2: 1.5}});
	fund2.xy(5, 0);
	let fund3 = new SqBase({name: "Fm3", l1: 3.0, l2: 2.0, h: 1.5, h_land: 1.2, γ_: 1.8, forces: {nMax: 12.3, nMin: 1.2, q1: 2, q2: 1.5, m1: 2, m2: 1.5}});
	fund3.xy(4, 0);
	fund1.listLayers = listLayers1; // задаем геологию для фундаментов
	fund2.listLayers = listLayers2;
	fund3.listLayers = listLayers2;
	// добавочная осадка будет считаться автоматически, если в списке всего один фундамент, то и добавочная осадка считаться не будет
	let fund_list = [fund1, fund2, fund3];
	for(var item of fund_list){item.osadka()}; // вычислили осадки в каждом фундаменте без учета влияния соседних
	let f_sall = function(obj:SqBase,flist:SqBase[]){// последовательно вычислит добавочную осадку в объетах
		if (flist != []){
			for(var elem of flist){
				obj.osadka_add(elem);
			}}
	};
	let i = 0;
	for(var item of fund_list){// берем отдельный фундамент и от всех оставшихся в списке вычисляем добавочную осадку
		let cflist= _.clone(fund_list);
		delete cflist[i];
		f_sall(item, cflist);
		i++;
		};
	// и распечатаем все нахер
	for(var item of fund_list){
		//item.pdf_render();
		console.log("фунд н");
		console.log(item);
		// нет, думаю надо поднимать приложение на ruby и печататься на нем
		// нигде нет такого удобного API
	};};
}
