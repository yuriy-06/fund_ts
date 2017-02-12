import isEqual = require('lodash.isequal');
export class Interpolation {
    static index(m:number[], p:number):number{ // возвращает индекс числа из массива
		if (m == undefined){console.log("in Interpolation.index m - undefined")};
        let count = 0;
        for(var item of m){
            if (item >= p){return count - 1} else {count +=  1;};
        
        };
        if ((count - 1) > m.length) {console.log(`in Interpolation.index - выход за пределы индекса, count - 1 = ${count - 1} > m.size = ${m.length}`);};
        return count - 1; //# на случай если p за пределами индекса
    }
    static int1d(m:number[], x:number):number{ // возвращает результат линейной интерполяции
		let x1 = m[0],
			y1 = m[1],
			x2 = m[2],
			y2 = m[3],
			tan = (y2 - y1)/(x2 - x1),
			z = tan*(x - x1) + y1;
        return z;
    }
    static int2d(main_m:number[][], xm:number[], ym:number[], x:number, y:number):number{
		if (main_m == undefined){console.log("in Interpolation.int2d main_m is indefined");};
		let x1index = this.index(xm, x),
			x2index = x1index + 1; // здесь будет ошибка если выше индекс вышел за пределы
	if (x2index > xm.length - 1){x2index = xm.length; x1index = x2index - 1;};/*
	т.к. индекс нумеруется с нуля, макс-ый индекс будет на 1 меньше длины массива
	*/
		let	y1index = this.index(ym,y),
			y2index = y1index + 1;
			if (y2index > ym.length - 1){y2index = ym.length; y1index = y2index - 1;};
		if (x1index == 	undefined || x2index == undefined ||	y1index == undefined ||	y2index == undefined) {console.log("in Interpolation.int2d x1index || x2index  ||	y1index  ||	y2index  is undefined");};
        if (isEqual(xm , []) || isEqual(ym , []) || isEqual(main_m , []))  {console.log(`in int2d - ошибка аргумента, xm=${xm}, ym=${ym}, main_m=${main_m}, x=${x}, y=${y}`)} ;
		let m1 = [xm[x1index], main_m[y1index][x1index], xm[x2index], main_m[y1index][x2index]],
			m2 = [xm[x1index], main_m[y2index][x1index], xm[x2index], main_m[y2index][x2index]],
			z1 = this.int1d(m1, x),
			z2 = this.int1d(m2, x),
			m = [ym[y1index], z1, ym[y2index], z2],
        	z = this.int1d(m, y);
		return z;
    }
}