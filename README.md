
# Recipe Finder Web Application 🍳

Welcome to the **Recipe Finder Web Application**! This intuitive, user-friendly platform allows you to easily import and explore your favorite recipes through a sleek, modern interface. Whether you're a culinary expert or a beginner, you'll love how fast and convenient it is to search for recipes, ingredients, or categories.

Built using cutting-edge technologies like **Astro**, **React**, **Tailwind CSS**, and **StackBlitz**, the app provides lightning-fast performance and responsiveness. The new AI-enhanced search will take your experience to the next level by offering more accurate and personalized results.

---

## 🚀 Features

- **Easy Recipe Import**: Import your recipe collection through JSON files. Each file can contain detailed information such as:
  - **Title**
  - **Ingredients** (with measurements)
  - **Directions**
  - **Category** (e.g., Mediterranean, Vegan, etc.)
  
- **Powerful Search Bar**: Quickly find recipes by searching for **titles**, **ingredients**, or **categories**. The advanced search functionality makes it easy to locate recipes even with partial information.
  
- **Interactive Chips**: After searching, the app displays interactive **chips** (tags) for ingredients, categories, and recipe types. These clickable chips allow you to filter and refine search results with ease.

- **AI-enhanced Search**: With our cutting-edge AI feature, the search becomes smarter over time. The AI learns from your queries, offering more accurate and relevant recipe suggestions based on your preferences.

- **Fully Responsive Design**: Enjoy a seamless browsing experience across all devices, whether you're on your mobile phone, tablet, or desktop.

- **Category Tags**: Organize and explore recipes by popular categories such as **Vegan**, **Vegetarian**, **Mediterranean**, and more.

---

## ⚙️ Technologies Used

This app leverages the power of modern web development tools to create a high-performance, user-friendly experience:

- **Astro**: A powerful static site generator for fast, optimized pages.
- **React**: A JavaScript library that powers the dynamic user interface components.
- **Tailwind CSS**: A utility-first CSS framework for rapid, customizable styling.
- **StackBlitz**: A real-time collaborative development environment that enhances the team’s ability to prototype and implement new features efficiently.
- **AI Integration**: Machine learning models that power the AI-enhanced search functionality, providing more accurate search results based on user input.

---

## 🛠️ How It Works

1. **Import Recipes**: Upload your JSON file containing a collection of recipes. Each recipe in the file includes essential information like:
   - **Title**: The name of the recipe.
   - **Ingredients**: A list of ingredients with measurements.
   - **Directions**: Step-by-step cooking instructions.
   - **Category**: The recipe’s classification (e.g., Vegan, Mediterranean, etc.).

2. **Search and Filter**: Use the search bar to find recipes based on:
   - Recipe **Title**
   - **Ingredients**
   - **Categories** (e.g., Vegan, Vegetarian, Mediterranean, etc.)

   As you search, the app will display **chips** (tags) representing the search criteria (ingredient, category, recipe name). Clicking on these chips will further filter the search results.

3. **AI Search**: The AI-enhanced search becomes more accurate with each use, offering results that are context-aware and personalized based on previous searches.

4. **Responsive Design**: Whether on your phone, tablet, or desktop, the app automatically adapts to fit your device, making the experience smooth and enjoyable on any screen.

---

## 🔧 Installation

To run the Recipe Finder Web Application locally on your machine, follow these simple steps:

### Prerequisites

Make sure you have **Node.js** and **npm** installed.

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/brianmuvel1/myrecipes.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd recipe-finder
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

   This command will start the development server and open the application in your default browser.

---

## 📝 How to Use

1. **Upload Your Recipe JSON File**: To get started, upload your **JSON file** containing recipes. The file should include **titles**, **ingredients**, **directions**, and **categories**.

It would look something like this:
````
{
  "recipes": [
    {
      "title": "Recipe Name",
      "category": ["Category1", "Category2"],
      "ingredients": ["ingredient1", "ingredient2"],
      "directions": ["step1", "step2"]
    }
  ]
}
``````

2. **Search for Recipes**: Use the search bar located at the top of the page. Search by:
   - **Recipe Title**
   - **Ingredient**
   - **Category** (e.g., Vegan, Mediterranean, etc.)

3. **Use Interactive Chips**: Once you perform a search, you'll see clickable **chips** that represent ingredients, categories, or recipe names. Clicking on any of these chips will filter and narrow down your search results.

4. **Enjoy AI-enhanced Search**: Our AI-powered search will improve over time as it learns from your input. It’s designed to suggest the most relevant recipes based on your preferences, helping you find exactly what you're looking for.



---

## 📸 Screenshots

Here are a few screenshots to give you a preview of the app:

![Recipe Finder Screenshot](.assets/recipe-finder-screenshot.png)

*(Screenshots are pending—please upload an image of the app in use)*

---

## 💡 Contributing

We welcome contributions to enhance the functionality and user experience of this project. To contribute:

1. **Fork the repository**.
2. **Clone your fork** (`git clone https://github.com/your-username/recipe-finder.git`).
3. **Create a new branch** for your feature (`git checkout -b feature-name`).
4. **Commit your changes** (`git commit -am 'Add feature'`).
5. **Push to your branch** (`git push origin feature-name`).
6. **Open a pull request** to the main repository.

We follow the **GitHub flow** for collaborative development, so feel free to submit pull requests or open issues.

---

## 📜 License

This project is licensed under the **MIT License**. See the [licence](LICENSE.md) file for more details.

---

## 🙏 Acknowledgements

- Thanks to the contributors and the open-source community for making this project possible.
- Special thanks to **StackBlitz** for real-time collaborative development tools and **Astro** for making web development fast and efficient.
  
---

Enjoy exploring your favorite recipes and discovering new culinary creations! 🍽️✨

---

**Happy Cooking!** 🥳🍲
