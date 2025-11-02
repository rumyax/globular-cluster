export const calc = {
    null: () => ({ x: 0, y: 0, z: 0 }),
    sum: (vector1, vector2) => ({ x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z }),
    minus: (vector1, vector2) => ({ x: vector1.x - vector2.x, y: vector1.y - vector2.y, z: vector1.z - vector2.z }),
    mul: (vector, scalar) => ({ x: vector.x * scalar, y: vector.y * scalar, z: vector.z * scalar }),
    div: (vector, scalar) => ({ x: vector.x / scalar, y: vector.y / scalar, z: vector.z / scalar }),
    square: vector => vector.x ** 2 + vector.y ** 2 + vector.z ** 2
};

export const calcAbsDiff = (vector1, vector2) => calc.square(calc.minus(vector1, vector2)) ** 0.5;
