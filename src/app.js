import './css/bootstrap.css';
import './css/style.css'; 
import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';

// initializer 
class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._tracker.loadItems();
        this._loadEventListeners();
    }

    _loadEventListeners() {
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'))

        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

     _newItem(type, e) {
        e.preventDefault();
    
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);
    
        // Validete inputs
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all the fields');
            return;
        }
         
         if (type === 'meal') {
            // + sign helps to make the string to number
            const meal = new Meal(name.value, +calories.value); 
            this._tracker.addMeal(meal);
         } else {
            const workout = new Workout(name.value, +calories.value); 
            this._tracker.addWorkout(workout);
         }
        
         // clean up the lasted data
         name.value = '';
         calories.value = '';

         //close the form window once the form get filled
         const collapseItem = document.getElementById(`collapse-${type}`);
         const bsCollapse = new Collapse(collapseItem, {
             toggle: true
         })
     }
    
    _newWorkOut(e) {
        e.preventDefault();

        const name = document.getElementById('workout-name');
        const calories = document.getElementById('workout-calories');

        // Valide input
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all the fields');
            return;
        }

        const workout = new Workout(name.value, +calories.value);

        this._tracker.addWorkout(workout);

        // clean up the lasted data
        name.value = '';
        calories.value = '';

        const collapseWorkOut = document.getElementById('collapse-workout');
         const bsCollapse = new bootstrap.Collapse(collapseWorkOut, {
             toggle: true
         })
    }

    _removeItem(type, e) {
        if (
          e.target.classList.contains('delete') ||
          e.target.classList.contains('fa-xmark')
        ) {
            if (confirm('Are you sure?')) {
              // take the target's nearest class which contains '.card', and gets it's id
            const id = e.target.closest('.card').getAttribute('data-id');
            type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

            // remove the item from the DOM
            const item = e.target.closest('.card');
            item.remove();
          }
        }
    }
    
    _filterItems(type, e) {
        // get the text from the input
        const text = e.target.value.toLowerCase();
        // targeting all the items (meal & workout) with .card, which contain the id of the items
        let items = document.querySelectorAll(`#${type}-items .card`); 
        // loop through all the items, both meal items and workout items
        items.forEach(function(item)
            // get the name inside the .card div, which is the name of the item
            {const name = item.firstElementChild.firstElementChild.textContent;
            //check every item's name to see if it has the text, if yes then match, if not then -1 
            if (name.toLowerCase().indexOf(text) !== -1) {
                // if the name of the item matche the searched item(text), then show the item 
                item.style.display = 'block';
            } else {
                item.style.display = 'none'; 
            }
        });
    }

    _reset() {
        this._tracker.reset();
        // reset the DOM of the APP part to zero, clean them up
        document.getElementById('meal-items').innerHTML = ''; 
        document.getElementById('workout-items').innerHTML = ''; 
        // for the input we use value to clean them up 
        document.getElementById('filter-meals').value = ''; 
        document.getElementById('filter-workouts').value = ''; 
    }

    _setLimit(e) {
        e.preventDefault();

        // get the input of the limit
        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Please add a limit');
            return;
        }

        // converse the limit.value from string to number
        this._tracker.setLimit(+limit.value);
        limit.value = '';

        // close the modal once the form got submit 
        const modalEl = document.getElementById('limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();
// console.log(app);