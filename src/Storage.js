class Storage {
    // static method can be called only on an object class, but not an object/instance.
    
    // to get the calorie limit
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;
        // if localStorage has nothing, it's going to be the defaul value 2000
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;  
        } else {
            // if localStorage has a number, we put the number into the variable calorieLimit (transform string to number with +)
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    // to set the calorie limit
    static setCalorieLimit(calorieLimit) {
        // localStorage.setItem(key, value);
        localStorage.setItem('calorieLimit', calorieLimit);
    }
    
    // to get the total calories
    static getTotalCalories(defaultCalories = 0) {
        let totalCalories; 
        if (localStorage.getItem('totalCalories' === null)) {
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories; 
    }

    // to set the total calories
    static updateTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

    // to get the meal from the localStorage
    static getMeals() {
        let meals; 
        if (localStorage.getItem('meals') === null) {
            meals = []; 
        } else {
            // parse it into an  normal array from an stringfy array
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    // to save the meal to localStorage
    static saveMeal(meal) {
        // take the meals (the older ones) from the storage to meals array
        const meals = Storage.getMeals();
        // add the new meal(the new one) to meals array
        meals.push(meal);
        // put the meals array into storage 
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    // to remove the meal from localStorage
    static removeMeal(id) {
        // get the meal from local storage
        const meals = Storage.getMeals();
        // find the clicked meal's id, and it's index, and take the meal with the index out 
        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        });

        // get ride of the clicked one and put the rest into the localStorage again
        localStorage.setItem('meals', JSON.stringify(meals)) 
    }

    // to get the workout from the localStorage
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    // to save the workout to localStorage
    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts)); 
    }

    // to remove workout from the localStorage
    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1); 
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts))
    }

    // clear all the data of the local storage 
    static clearAll() {
        // clear everything except the calorie limit 
        localStorage.removeItem('totalCalories');
        localStorage.removeItem('meals');
        localStorage.removeItem('workout');

        // clear everything including the calories limit 
        // localStorage.clear();
    }
}

export default Storage; 