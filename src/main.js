'use strict';

const G = 6.67;
const todegree = radian => (radian * 180) / Math.PI;

class SpaceObject {
    constructor(mass, position, forceVector, space) {
        this.position = position;
        this.forceVector = forceVector;
        this.mass = mass;
        this.space = space;
        this.space.spaceObjects.push(this);
        this.timeframe = 1;
    }

    fv() {
        let resultVector = this.space.spaceObjects
            .filter(so => so != this)
            .map(so => this.position.substract(so.position))
            .reduce((a, b) => a.add(b), this.forceVector.vector);

        let forceVectors = this.space.spaceObjects
            .filter(so => so != this)
            .map(so => {
                let force = new GravityForce(so, this);
                let vector = this.position.substract(so.position);
                return new ForceVector(force, vector);
            });

        forceVectors.push(this.forceVector);

        let force = forceVectors
            .filter(fv => fv.force.getValue() != 0)
            .map(fv => {
                let cosA = Math.abs(fv.vector.multiply(resultVector) / (fv.vector.magnitude() * resultVector.magnitude()));
                // console.log(`${fv.force.getValue()}, ${resultVector}, ${fv.vector}, ${todegree(Math.acos(cosA))}`);
                return fv.force.getValue() * cosA;
            })
            .reduce((a, b) => a + b, 0);
        this.forceVector = new ForceVector(new Force(force), resultVector);
        return this.forceVector;
    }

    move() {
        let forceVector = this.fv();
        let f = forceVector.force.getValue();
        let m = this.mass;
        let a = f / m;
        let v = a * this.timeframe;
        let d = v * 1;
        let angleR = Math.atan2(forceVector.vector.y, forceVector.vector.x);
        let dx = d * Math.cos(angleR);
        let dy = d * Math.sin(angleR);
        this.position.x += dx;
        this.position.y += dy;
    }
}

class Time {
    constructor(stop, space, beforeIteration, onEach, afterIteration) {
        this.stop = stop;
        this.space = space;
        this.beforeIteration = beforeIteration;
        this.onEach = onEach;
        this.afterIteration = afterIteration;
        this.t = 0;
    }

    hasNext() {
        return this.stop(this.t);
    }

    next() {
        this.beforeIteration(this.space);
        this.space.spaceObjects.forEach(so => so.fv());
        this.space.spaceObjects.forEach(value => this.onEach(value));
        this.space.spaceObjects.forEach(so => so.move());
        this.afterIteration(this.space);
        this.t++;
    }
}

class ForceVector {
    constructor(force, vector) {
        this.vector = vector;
        this.force = force;
    }
}

class Force {
    constructor(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

}

class GravityForce extends Force {

    constructor(one, another) {
        super();
        this.one = one;
        this.another = another;
    }

    getValue() {
        if (this.value == null) {
            let one = this.one.position;
            let another = this.another.position;
            let distanceBetweenTheTwo = Math.pow(one.x - another.x, 2) + Math.pow(one.y - another.y, 2);
            this.value = (G * this.one.mass * this.another.mass) / distanceBetweenTheTwo;
        }
        return this.value;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    substract(anotherPoint) {
        return new Vector(anotherPoint.x - this.x, anotherPoint.y - this.y)
    }

    toString() {
        return `p(${this.x}, ${this.y})`;
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(anotherVector) {
        return new Vector(this.x + anotherVector.x, this.y + anotherVector.y);
    }

    multiply(anotherVector) {
        return this.x * this.y + anotherVector.x * anotherVector.y;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    toString() {
        return `v(${this.x}, ${this.y})`;
    }
}

class Space {
    constructor() {
        this.spaceObjects = [];
    }
    add(spaceObject) {
        this.spaceObjects.push(spaceObject);
    }
}

module.exports = {
    SpaceObject: SpaceObject,
    Point: Point,
    GravityForce: GravityForce,
    ForceVector: ForceVector,
    Vector: Vector,
    Space: Space,
    Force: Force,
    Time: Time
}