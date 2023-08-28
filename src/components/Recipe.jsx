import "../styles/Recipe.css";

function Recipe() {
    return (
        <div className="recipe-card">
            <h1 className="recipe-title">Recipe name</h1>
            <div className="recipe-ingredients">
                <h3>Ingredients</h3>
                <ul>
                    <li>Ing 1</li>
                    <li>Ingredient 2</li>
                    <li>Ing 3</li>
                    <li>Ing 4</li>
                </ul>
            </div>
            <div>
                <h3>Steps</h3>
                <ol>
                    <li>Step 1</li>
                    <li>Step 2</li>
                </ol>
            </div>
        </div>
    );
}

export default Recipe;
