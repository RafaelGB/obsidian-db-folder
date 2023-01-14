/**
 * Create two columns as arguments (your steps, your goal) both of type number.
 * (the name of the columns can be different)
 * 
 * Formula: ${db.js.goalStatusTime(row.mySteps,row.myGoal)}
 * @param {*} stepsValue int
 * @param {*} goalValue int
 * @returns string representing the status of the goal
 */
function goalStatusTime(stepsValue, goalValue) {
// Calculate in hours and minutes how much time is needed to achieve that number of steps.
// then calculate walking (0.6 seconds/step) and running (0.4 seconds/step).
    var walk = (new Date(((goalValue - stepsValue) * 0.6) * 1000).toISOString().substring(11, 16))
    var run = (new Date(((goalValue - stepsValue) * 0.4) * 1000).toISOString().substring(11, 16))


// Calculation of the percentcentage of Steps with respect to StepsGoal
    var percent = Math.round((stepsValue / goalValue) * 100);
    
  
// I create the conditions, depending on the percentcentage achieved, one color or another will be shown.
// I have also added the walking and running time calculated above.
    if (percent < 80){
    return "🟥 🚶‍♂️" + walk + " - " + "🏃‍♂️" + run; 

    }else if (percent >= 80 && percent < 100  ){
    return "🟨 🚶‍♂️" + walk + " - " + "🏃‍♂️" + run; 
    
    }else if (percent >= 100 && percent < 150){
    return "🟩 Great work, keep it up!"; 
    
    }else if (percent >= 150 && percent < 200){
    return "🟦 Awesome, keep it up!"; 

    }else if (percent >= 200){
    return "🟪 ⭐🏆⭐"; 
    }
   
}

module.exports = goalStatusTime