// Function to clear meal details
function clearMealDetails() {
    const mealDetails = document.getElementById('meal-details');
    mealDetails.innerHTML = '';
}

// Fetch all categories from the API and display them
function fetchCategories() {
    return fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(response => response.json())
    .then(data => {
        displayCategories(data.categories);
        populateSidebarCategories(data.categories);
    })
    .catch(error => console.log(error));
}

// Display categories dynamically in the grid formate
function displayCategories(categories) {
    const categoryGrid = document.getElementById('category-grid');
    categoryGrid.innerHTML = '';  // Clear any existing categories

    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('category-card');

        // Adding category image and name
        categoryCard.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="category-image"/>
            <p class="category-name">${category.strCategory}</p>
        `;

        // Setting the data-category for fetching meals based on category
        categoryCard.dataset.category = category.strCategory;

        // Adding event listener for category click
        categoryCard.addEventListener('click', () => {
            clearMealDetails(); // Clear meal details before showing category meals
            // Fetch meals filtered by category
            fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`);
        });

        categoryGrid.appendChild(categoryCard);
    });
}

// Function to fetch meals from API
function fetchMeals(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.meals) {
                displayMeals(data.meals);
            } else {
                displayMeals([]);  // Pass an empty array if no meals found
            }
        })
        .catch(error => console.log(error));
}



// Function to display meals
function displayMeals(meals) {
    const mealGrid = document.getElementById('meal-grid');
    mealGrid.innerHTML = ''; // Clear previous results

    // Add a heading above the meal list
    const heading = document.createElement('h2');
    heading.textContent = 'MEAL';
    heading.classList.add('meal-heading'); // Optional: Add class for styling
    mealGrid.appendChild(heading);


    if (meals.length === 0) {
        mealGrid.innerHTML = '<p>No meals found!</p>';
        return;
    }

    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');

        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal ? meal.strMeal : 'Unnamed Meal'}</h3>
        `;

        // Add event listener for each meal to show details when clicked
        mealCard.addEventListener('click', () => {
            fetchMealDetails(meal.idMeal);
        });

        mealGrid.appendChild(mealCard);
    });
}

// Function to fetch meal details
function fetchMealDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.meals) {
                displayMealDetails(data.meals[0]);
            }
        })
        .catch(error => console.log(error));
}

// Function to display meal details
function displayMealDetails(meal) {
    const mealDetails = document.getElementById('meal-details');
    // Add a heading above the meal Detailes
    const heading2 = document.createElement('h2');
    heading2.textContent = 'MEAL DETAILES';
    heading2.classList.add('meal-heading'); // Optional: Add class for styling
    mealDetails.appendChild(heading2);

    mealDetails.innerHTML = `
    <div class = "singleItem">
        <div class = "imgItem">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        </div>
        <div class = "textItem">
            <h2>${meal.strMeal}</h2><hr>
            <h3>CATEGORY : ${meal.strCategory}</h3>
            <p>Source : ${meal.strMealThumb}</p>
            <b>Tags : ${meal.strTags}</b>
            <div class = "ingredients">
                <h3>Ingredients :</h3>
                    <ul>
                        ${Array.from({ length: 20 }, (_, i) => i + 1)
            .map(i => meal[`strIngredient${i}`] ? `<li><span>${i}</span> ${meal[`strIngredient${i}`]} </li>` : '')
            .join('')
        }
                </ul>
            </div>
        </div>
    </div>
    <div class = "measures">
        <h3>Measures :</h3>
        <ul>
            ${Array.from({ length: 20 }, (_, i) => i + 1)
            .map(i => meal[`strMeasure${i}`] ? `<li><span>📌</span> ${meal[`strMeasure${i}`]}</li>` : '')
            .join('')
        }
    </ul>
    <div class = "Instructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    `;
}

fetchCategories();