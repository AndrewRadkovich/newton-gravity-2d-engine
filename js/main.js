class SpaceObject {
    constructor(mass, radius, color, position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
    }
}

class ForceVector {
    constructor(angle, force) {
        this.angle = angle;
        this.force = force;
    }

    x() {
        return this.force.x(this.angle.value());
    }

    y() {
        return this.force.y(this.angle.value());
    }
}

class Angle {
    constructor(one, another) {
        this.one = one;
        this.another = another;
    }

    value() {
        let one = this.one.position;
        let another = this.another.position;

        let dx = one.x - another.x;
        let dy = one.y - another.y;

        return Math.atan(dx / dy);
    }
}

class Force {

    getValue() {
        return 0;
    }

    x(angle) {
        return this.getValue() * Math.cos(angle);
    }

    y(angle) {
        return this.getValue() * Math.sin(angle);
    }
}

class AccelerationForce extends Force {

    constructor(current, prev) {
        this.current = current;
        this.prev = prev;
    }

    getValue() {
        let a = (this.current.velocity - this.prev.velocity) / 1;
        return this.current.mass * a;
    }
}

class GravityForce extends Force {

    static G = 6.67;

    constructor(one, another) {
        this.one = one;
        this.another = another;
        this.value = null;
    }

    getValue() {
        if (this.value == null) {
            let one = this.one.position;
            let another = this.another.position;
            let distanceBetweenTheTwo = Math.pow(one.x - another.x, 2) + Math.pow(one.y - another.y, 2);
            this.value = (GravityForce.G * this.one.mass * this.another.mass) / distanceBetweenTheTwo;
        }
        return this.value;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const sum = (a, b) => a + b;

const fx = forceVector => forceVector.x();

const fy = forceVector => forceVector.y();

class SpaceTime {
    constructor(canvas) {
        this.canvas = canvas;
        this.spaceObjects = [];
        setTimeout(() => this.drawSpaceObjects(), 40);
    }

    add(spaceObject) {
        this.spaceObjects.push([null, spaceObject]);
    }

    start() {
        this.drawSpaceObjects();
    }

    drawSpaceObjects() {
        this.spaceObjects.forEach((spaceObjectT) => {
            let spaceObject = spaceObjectT[1];
            this.drawSingleSpaceObject(spaceObject);
            let acccelarationForce = new AccelerationForce(spaceObjectT[1], spaceObjectT[0]);
            let force = this.calculateGravityForce(spaceObject);
        });
    }

    calculateGravityForce(spaceObject) {
        let forceVectors = this.spaceObjects
            .map(otherSpaceObject => new ForceVector(
                new Angle(spaceObject, otherSpaceObject),
                new GravityForce(spaceObject, otherSpaceObject)
            ));
        let sumFx = forceVectors.map(fx).reduce(sum);
        let sumFy = forceVectors.map(fy).reduce(sum);
        let resultForce = Math.sqrt(Math.pow(sumFx, 2) + Math.pow(sumFy, 2));
        let resultAngle = Math.atan(sumFx / sumFy);
        return {
            force: resultForce,
            angle: resultAngle
        }
    }

    applyForce(spaceObject) {

    }

    calculateGravityForceBetweenTwo(one, another) {

    }

    drawSingleSpaceObject(spaceObject) {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(spaceObject.position.x, spaceObject.position.y, spaceObject.radius, 0, 2 * Math.PI);
        ctx.fillStyle = spaceObject.color;
        ctx.fill();
    }
}