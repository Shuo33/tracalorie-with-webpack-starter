class Meal {
    constructor(name, calories) {
        //Math.random().toString(16) generate a random hexadecimal string
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

export { Meal, Workout };