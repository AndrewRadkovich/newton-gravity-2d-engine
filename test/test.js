const assert = require('assert');
const core = require('../src/main');
const SpaceObject = core.SpaceObject;
const Point = core.Point;
const Vector = core.Vector;
const Force = core.Force;
const Space = core.Space;
const ForceVector = core.ForceVector;
const Time = core.Time;

const todegree = radian => (radian * 180) / Math.PI;

describe('Point', () => {
    describe('#subsctract(point)', () => {
        it('should create vector', () => {
            let p1 = p(10, 10);
            let p2 = p(20, 20);

            assert.deepEqual(p1.substract(p2), v(10, 10));
        });
    });
});

describe('Vector', () => {
    describe('#add(vector)', () => {
        it('should sum vectors', () => {
            let vectorSum = v(10, 10).add(v(10, 0));
            assert.deepEqual(vectorSum, v(20, 10));
        });
    });
});

describe('Space', () => {
    describe('#fv()', () => {
        it('should sum vectors', () => {
            let space = new Space();

            let so1 = so(10, p(10, 10), fv(f(0), v(0, 0)), space);
            let so2 = so(10, p(20, 20), fv(f(0), v(0, 0)), space);
            let so3 = so(10, p(20, 10), fv(f(0), v(0, 0)), space);

            assert.deepEqual(so1.fv(), fv(f(9.129688162967902), v(20, 10)));
            assert.deepEqual(so2.fv(), fv(f(9.129688162967902), v(-10, -20)));
            assert.deepEqual(so3.fv(), fv(f(9.432804461028542), v(-10, 10)));
        });
    });

    describe('#move()', () => {
        it('should move object', () => {
            let space = new Space();

            let so1 = so(10, p(10, 10), fv(f(10), v(10, 10)), space);

            so1.move();
            assert.deepEqual(so1.position, p(10.707106781186548, 10.707106781186548));

            so1.move();
            assert.deepEqual(so1.position, p(11.414213562373096, 11.414213562373096));
        });
    });

    describe('#over time()', () => {
        it('should move objects over time', () => {
            let space = new Space();

            let so1 = so(10, p(10, 10), fv(f(0), v(0, 0)), space);
            let so2 = so(10, p(20, 20), fv(f(0), v(0, 0)), space);
            let so3 = so(10, p(20, 10), fv(f(0), v(0, 0)), space);

            let time = new Time(t => true, space, space => space, so => so, space => space);

            time.next();
            assert.deepEqual([so1.position, so2.position, so3.position], [
                p(12.30826033457714, 11.15413016728857),
                p(18.899453607419208, 17.5835230045461),
                p(16.403949061097677, 13.585596508770909)
            ]);
            time.next();
            assert.deepEqual([so1.position, so2.position, so3.position], [
                p(47.00630042378592, 32.48033880309688),
                p(18.497248276094304, 4.358939612853588),
                p(17.161413716211634, 15.430882080748736)
            ]);
            time.next();
            assert.deepEqual([so1.position, so2.position, so3.position], [
                p(-503.8242310177523, -491.33213458763043),
                p(-2.2603155629620417, -15.820879955832114),
                p(1.3706376206386093, -0.523278828372904)
            ]);
        });
    });
});

function f(value) {
    return new Force(value);
}

function fv(force, vector) {
    return new ForceVector(force, vector);
}

function so(mass, position, fv, space) {
    return new SpaceObject(mass, position, fv, space);
}

function p(x, y) {
    return new Point(x, y);
}

function v(x, y) {
    return new Vector(x, y);
}
