import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://recipes-3cc20-default-rtdb.firebaseio.com/"
    // https://playground-b3e1b-default-rtdb.firebaseio.com/
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const recipesDB = ref(database, "recipes")

const newRecipeBtn = document.getElementById("new-recipe-btn")
const newRecipeInputCont = document.getElementById("new-recipe-input-container")
const newRecipeNameInput = document.getElementById("new-recipe-name-input")
const newRecipeAddBtn = document.getElementById("new-recipe-add-btn")

const recipesSection = document.getElementById("recipes-section")

newRecipeBtn.addEventListener('click', function() {
    newRecipeInputCont.classList.toggle("disabled")
})

newRecipeAddBtn.addEventListener('click', function(){
    let currentRecipeName = newRecipeNameInput.value

    if(currentRecipeName) {
        addRecipe(currentRecipeName)
    }

    clearInput(newRecipeNameInput)
})

function clearInput (el) {
    el.value = ""
}

function addRecipe (recipeName) {
    set (ref(database, 'recipes/' + recipeName), {
        /* recipeName: recipeName, */
        ingredients: "",
        steps: ""
    })
}

function renderRecipeCard(recipeName) {

    let recipeCard = document.createElement("div")
    recipeCard.classList.add("recipe-container")
    recipeCard.innerHTML = `
        <h1>${recipeName}</h1>
        <button class="btn close" id="close-btn-${recipeName}">x</button>
        <div class="ingredients">
            <div class="header">
                <h2>Ingredientes</h2>
                <button class="btn" id="show-ingr-input-${recipeName}"><span class="grow">+</span></button>
            </div>

            <div class="input-container disabled" id="ingr-input-container-${recipeName}">
                <input class="ctd-input" id="ctd-input-${recipeName}" type="text" placeholder="Ctd.">
                <input class="unit-input" id="unit-input-${recipeName}" type="text" placeholder="Ud.">
                <input class="ingr-input" id="ingr-input-${recipeName}" type="text" placeholder="Ingrediente">
                <button class="btn large-btn" id="add-ingr-btn-${recipeName}">Añadir</button>
            </div>

            <ul id="ingredients-body-${recipeName}">
            </ul>
        </div>

        <span class="line"></span>

        <div class="steps">
            <div class="header">
                <h2>Preparación</h2>
                <button class="btn" id="show-step-input-${recipeName}"><span class="grow">+</span></button>
            </div>

            <div class="input-container disabled" id="step-input-container-${recipeName}">
                <textarea id="step-input-${recipeName}" placeholder="Añadir paso"></textarea>
                <button id="add-step-btn-${recipeName}" class="btn large-btn">Añadir</button>
            </div>

            <ol id="steps-body-${recipeName}">
            </ol>
        </div>
    `

    recipesSection.append(recipeCard)

    const showIngrInput = document.getElementById(`show-ingr-input-${recipeName}`)
    const ingrInputCont = document.getElementById(`ingr-input-container-${recipeName}`)

    showIngrInput.addEventListener("click", function() {
        ingrInputCont.classList.toggle("disabled")
    })

    const showStepInput = document.getElementById(`show-step-input-${recipeName}`)
    const stepInputCont = document.getElementById(`step-input-container-${recipeName}`)

    showStepInput.addEventListener("click", function() {
        stepInputCont.classList.toggle("disabled")
    })

    const addIngrBtn = document.getElementById(`add-ingr-btn-${recipeName}`)
    const ctdInput = document.getElementById(`ctd-input-${recipeName}`)
    const unitInput = document.getElementById(`unit-input-${recipeName}`)
    const ingrInput = document.getElementById(`ingr-input-${recipeName}`)

    addIngrBtn.addEventListener("click", function(){

        if (ingrInput.value != ''){
            push(ref(database, `recipes/${recipeName}/ingredients/`),
                    `${ctdInput.value} ${unitInput.value} ${ingrInput.value}`)
        }

        clearInput(ctdInput)
        clearInput(unitInput)
        clearInput(ingrInput)
    })

    const addStepInput = document.getElementById(`step-input-${recipeName}`)
    const addStepBtn = document.getElementById(`add-step-btn-${recipeName}`)
    
    addStepBtn.addEventListener("click", function() {

        if (addStepInput.value != ''){
            push(ref(database, `recipes/${recipeName}/steps/`),
                    `${addStepInput.value}`)
        }

        clearInput(addStepInput)
    })

    const closeBtn = document.getElementById(`close-btn-${recipeName}`)

    closeBtn.addEventListener('click', function(){
        let recipeLocationOnDB = ref(database, `recipes/${recipeName}/`)

        remove(recipeLocationOnDB)
    })

}

function appendIngrEl (recipeName, ingredients) {
    let body = document.getElementById(`ingredients-body-${recipeName}`)

    for(let i = 0; i < ingredients.length; i++){
        let ingrItem = document.createElement("li")
        ingrItem.textContent = ingredients[i][1]

        body.append(ingrItem)
        
        ingrItem.addEventListener('click', function(){
            let ingrLocationInDB = ref(database, `recipes/${recipeName}/ingredients/${ingredients[i][0]}/`)
            remove(ingrLocationInDB)
        })
    }

}

function appendStepEl (recipeName, steps) {

    let body = document.getElementById(`steps-body-${recipeName}`)

    for(let i = 0; i < steps.length; i++){
        let stepItem = document.createElement("li")
        stepItem.textContent = steps[i][1]

        body.append(stepItem)

        stepItem.addEventListener('click', function(){
            let stepLocationInDB = ref(database, `recipes/${recipeName}/steps/${steps[i][0]}/`)
            remove(stepLocationInDB)
        })
    }
}


function clearRecipesEl () {
    recipesSection.textContent = ""
}

onValue (recipesDB, function(snapshot){

    if( snapshot.exists() ){
        let recipesArray = Object.entries(snapshot.val())

        clearRecipesEl()
        for(let i=0; i < recipesArray.length; i++){

            let currentRecipeName = recipesArray[i][0]
            let currentIngredients = recipesArray[i][1].ingredients
            let currentSteps = recipesArray[i][1].steps

            renderRecipeCard(currentRecipeName)

            if (currentIngredients != undefined){
                
                let currentIngredientsArray = Object.entries(currentIngredients)

                appendIngrEl(currentRecipeName, currentIngredientsArray)
            }

            if(currentSteps != undefined) {

                let currentStepsArray = Object.entries(currentSteps)

                appendStepEl(currentRecipeName, currentStepsArray)
            }

        }
    } else {
        recipesSection.innerHTML = `
        <h1 class="welcome-msg">Hola!<br>
            Este es el lugar indicado para añadir tus recetas favoritas<br>
            👩🏻‍🍳 🧑🏻‍🍳 👨🏻‍🍳
        </h1>
        `
    }

})
