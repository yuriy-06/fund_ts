"use strict";
class Interpolation {
    index(m, p) {
        let count = 0;
        for (var item of m) {
            if (item >= p) {
                return count - 1;
            }
            else {
                count += 1;
            }
            ;
        }
        if ((count - 1) > m.length) {
            console.log(`in Interpolation.index - выход за пределы индекса, count - 1 = ${count - 1} > m.size = ${m.length}`);
        }
        ;
        return count - 1; //# на случай если p за пределами индекса
    }
    int1d(m, x) {
        let x1 = m[0];
        let y1 = m[1];
        let x2 = m[2];
        let y2 = m[3];
        let tan = (y2 - y1) / (x2 - x1);
        let z = tan * (x - x1) + y1;
        return z;
    }
    int2d(main_m, xm, ym, x, y) {
        let x1index = this.index(xm, x);
        let x2index = x1index + 1;
        let y1index = this.index(ym, y);
        let y2index = y1index + 1;
        if (xm == [] || ym == [] || main_m == []) {
            console.log(`in int2d - ошибка аргумента, xm=${xm}, ym=${ym}, main_m=${main_m}, x=${x}, y=${y}`);
        }
        ;
        let m1 = [xm[x1index], main_m[y1index][x1index], xm[x2index], main_m[y1index][x2index]];
        let m2 = [xm[x1index], main_m[y2index][x1index], xm[x2index], main_m[y2index][x2index]];
        let z1 = this.int1d(m1, x);
        let z2 = this.int1d(m2, x);
        let m = [ym[y1index], z1, ym[y2index], z2];
        let z = this.int1d(m, y);
        return z;
    }
}
exports.Interpolation = Interpolation;
//# sourceMappingURL=interpolation.js.map