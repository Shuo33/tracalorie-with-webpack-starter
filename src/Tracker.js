import Storage from './Storage';

class CalorieTracker {
    // constructor runs when app loads 
    constructor() {
        // since 'getCalorieLimit()' is a static method inside the 'storage' class, we can call it only on it's class, we can't call it on an object/instance
        this._calorieLimit = Storage.getCalorieLimit(); 
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        // the constructor runs immediately when you instantiate the class
        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        // keep the 'set daily limit' value the same as the actual limit value 
        document.getElementById('limit').value = this._calorieLimit; 
    }

    // Public Methods / API
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories; 
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        // after every changes, we need to updated it to the DOM
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        //after every changes, we need to updated it to the DOM so to show it
        this._render(); 
    }

    // To identify the meal that got clicked and remove it from the 'this._meals' array
    removeMeal(id) {
        // find the index that we want to remove: when the clicked id = the meal'id, we take that index from the 'this._meals' array and put it into index variable
        // const index = this._meals.findIndex(function (meal) { meal.id === id }) only arrow function work
        const index = this._meals.findIndex((meal) => meal.id === id )
        //if the clicked id has been found in the array
        if (index !== -1) {
            const meal = this._meals[index]; //get the meal with the meal's id from the array
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index, 1); // take the meal out of the array completely, delete it from the array
            Storage.removeMeal(id);
            this._render();
        }
    }

    // To identify the workout that got clicked and remove it from the 'this._workouts' array
    removeWorkout(id) {
        // const index = this._workouts.findIndex(function (workout){workout.id === id}); didn't work, have to use arrow 
        const index = this._workouts.findIndex((workout) => workout.id === id);
        if (index !== -1) {
            const workout = this._workouts[index]; 
            this._workouts.splice(index, 1);
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    // To reset 
    reset() {
        this._totalCalories = 0; 
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._render();
    }

    // To set calorieLimit
    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit; 
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    // to load _meals array and _workouts array from the storage to the DOM 
    // note that we can only use arrow function cos normal function didnt work
    loadItems() {
        this._meals.forEach(
            meal => this._displayNewMeal(meal)
        );

        this._workouts.forEach(
            workout => this._displayNewWorkout(workout)
        );
    }

    // Private Methods
    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories; 
    }

    _displayCaloriesLimit() {
        const caloriesLimitEl = document.getElementById('calories-limit');
        caloriesLimitEl.innerHTML = this._calorieLimit; 
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');

        const consumed = this._meals.reduce(function (total, meal) {
            return total + meal.calories;
        }, 0);

        caloriesConsumedEl.innerHTML = consumed; 
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        const burned = this._workouts.reduce(function (total, workout) {
            return total + workout.calories;
        }, 0);
        
        caloriesBurnedEl.innerHTML = burned; 
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remaining;

        const progressEl = document.getElementById('calorie-progress');

        if (remaining <= 0) {
            // change the Calories Remaining background color from green to red 
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            // change the progress bar color from green to red 
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        } else {
            // change the Calories Remaining background color back to green 
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            // change the progress bar color back to green
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
        }
    }

    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        // to limit the max width to 100% 
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }

    _displayNewMeal(meal) {
    const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name} </h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
        `;
        mealsEl.appendChild(mealEl);
    }

    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name} </h4>
                 <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                 </div>
                 <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
            </div>
        </div>
        `;

        workoutsEl.appendChild(workoutEl);
    }


    // after every changement, we need to rend it so the systeme can update it 
    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress()
    }
}

// const tracker = new CalorieTracker();

// const breakfast = new Meal('breakfast', 600);
// tracker.addMeal(breakfast);

// const run = new Workout('run', 300);
// tracker.addWorkout(run);

// console.log(tracker._meals);
// console.log(tracker._workouts);
// console.log(tracker._totalCalories);

export default CalorieTracker;