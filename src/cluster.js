import { calc, calcAbsDiff } from './calc.js';
import conf from '../data/conf.json' with { type: 'json' };

const { capacity, radius } = conf; // [[ G = 1 ]] :: [[ dt = 1 ]]

class Cluster {
    meta = { mass: 0, time: 0, densityCenter: calc.null(), halfMassRadius: 0 };
    display = { scale: 0, cell: 0, x: 0, y: 0, grid: true };
    stars = [];

    constructor(capacity, radius) {
        this.display.scale = 1000 / radius;
        this.display.cell = radius / 5;

        for (let i = 0; i < capacity; i++) {
            const p = {
                abs: Math.random() ** 0.7 * radius, // position distribution
                lat: Math.random() * Math.PI,
                lon: Math.random() * Math.PI * 2
            };

            const position = {
                x: p.abs * Math.cos(p.lon) * Math.sin(p.lat),
                y: p.abs * Math.sin(p.lon) * Math.sin(p.lat),
                z: p.abs * Math.cos(p.lat)
            };

            const v = {
                abs: 1 - p.abs / radius, // velocity distribution
                lat: Math.random() * Math.PI,
                lon: Math.random() * Math.PI * 2
            };

            const velocity = {
                x: v.abs * Math.cos(v.lon) * Math.sin(v.lat),
                y: v.abs * Math.sin(v.lon) * Math.sin(v.lat),
                z: v.abs * Math.cos(v.lat)
            };

            const mass = Math.floor(Math.random() * 10) + 1; // mass distribution
            let color;

            switch (mass) { // color distribution
                case 1: color = 'rgb(255, 0, 0)'; break;
                case 2: color = 'rgb(255, 50, 0)'; break;
                case 3: color = 'rgb(255, 100, 0)'; break;
                case 4: color = 'rgb(255, 150, 0)'; break;
                case 5: color = 'rgb(255, 200, 0)'; break;
                case 6: color = 'rgb(255, 255, 50)'; break;
                case 7: color = 'rgb(255, 255, 100)'; break;
                case 8: color = 'rgb(255, 255, 150)'; break;
                case 9: color = 'rgb(255, 255, 200)'; break;
                case 10: color = 'rgb(255, 255, 255)'; break;
            }

            this.stars.push({ mass, color, position, velocity });
        }

        let clusterImpulse = calc.null();

        for (let i = 0; i < this.stars.length; i++) {
            this.meta.mass += this.stars[i].mass;
            clusterImpulse = calc.sum(clusterImpulse, calc.mul(this.stars[i].velocity, this.stars[i].mass));
        }

        const clusterVelocity = calc.div(clusterImpulse, this.meta.mass);

        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].velocity = calc.minus(this.stars[i].velocity, clusterVelocity);
        }
    }

    attraction = (star1, star2, eps) => {
        const diff = calc.minus(star2.position, star1.position);
        return calc.div(calc.mul(diff, star1.mass * star2.mass), (calc.square(diff) + eps) ** 1.5);
    };

    step = eps => {
        const force = this.stars.map(calc.null);

        for (let i = 0; i < this.stars.length; i++) for (let j = i + 1; j < this.stars.length; j++) {
            const f = this.attraction(this.stars[i], this.stars[j], eps);
            force[i] = calc.sum(force[i], f);
            force[j] = calc.minus(force[j], f);
        }

        for (let i = 0; i < this.stars.length; i++) {
            const acceleration = calc.div(force[i], 2 * this.stars[i].mass);
            this.stars[i].velocity = calc.sum(this.stars[i].velocity, acceleration);
            this.stars[i].position = calc.sum(this.stars[i].position, this.stars[i].velocity);
            this.stars[i].velocity = calc.sum(this.stars[i].velocity, acceleration);
        }

        this.meta.time++;
    };

    massDistances = position => this.stars.map(s => ({
        mass: s.mass,
        distance: calcAbsDiff(position, s.position)
    })).sort((a, b) => a.distance - b.distance);

    params = num => {
        let maxDensity = -Infinity;

        for (const star of this.stars) {
            const neighbors = this.massDistances(star.position).slice(0, num);
            const neighborsMass = neighbors.reduce((sum, neighbor) => sum + neighbor.mass, 0);
            const neighborsDensity = neighborsMass / neighbors[num - 1].distance ** 3;

            if (neighborsDensity > maxDensity) {
                this.meta.densityCenter = { ...star.position };
                maxDensity = neighborsDensity;
            }
        }

        const massDistancesFromDensityCenter = this.massDistances(this.meta.densityCenter);
        const halfMass = this.meta.mass / 2;
        let sumMass = 0;

        for (const md of massDistancesFromDensityCenter) {
            sumMass += md.mass;

            if (sumMass > halfMass) {
                this.meta.halfMassRadius = md.distance;
                break;
            }
        }
    };

    json = () => JSON.stringify({ meta: this.meta, display: this.display, stars: this.stars });
}

export const cluster = new Cluster(capacity, radius);
