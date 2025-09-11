# MealPrep Website

A Flask-based web application that helps users plan weekly meals and workouts. Users can:
- Register and log in
- Browse, filter, and select workouts and recipes
- Assign meals and workouts to specific days of the week
- Track total daily calories based on selected recipes
- (Admins) Add new recipes, workouts, and additional admins

This project was developed during first year of college as a learning exercise in Python, Flask, HTML, CSS (and some JavaScript).

---

## Features

### Core User Features
- User registration & authentication (hashed passwords via Werkzeug)
- Browse workouts (filter by muscle group)
- Browse recipes (filter by ingredient)
- Add selected workouts & recipes to a weekly plan
- View combined weekly planner with per-day calorie totals
- Calorie counter form (sets a target stored in session)
- Remove workouts/recipes from plan

### Admin Features
- Auto-creation of a default admin user (username: `admin`, password: `123`) if not present
- Restricted admin-only pages (`/admin`, `/new_recipe`, `/new_workout`, `/add_admin`)
- Add new recipes (with optional image upload)
- Add workouts
- Promote additional users to admin

### Other
- Server-side session management via filesystem
- Defensive checks to avoid duplicate plan entries
- Dynamic form choice loading (days of week, filters)
- Basic flash messaging for feedback

---

## Tech Stack

| Layer            | Technology |
|------------------|------------|
| Language         | Python 3.x |
| Web Framework    | Flask |
| Forms            | Flask-WTF (WTForms) |
| Sessions         | Flask-Session (filesystem backend) |
| Auth             | Werkzeug password hashing |
| Templates        | Jinja2 (Flask default) |
| Frontend         | HTML / CSS / (optional JavaScript) |
| Database         | SQLite via `get_db()` helper |
| File Uploads     | Handled via Flask & `werkzeug.utils.secure_filename` |

---

## Application Architecture

The central application logic is in `Website/app.py`, which:
- Configures Flask + session + allowed upload extensions
- Registers request pre-load hook (`@app.before_request`) to:
  - Pull session values into `g`
  - Ensure an admin user exists
- Registers teardown to close DB connections
- Defines decorators:
  - `login_required`
  - `admin_required`
- Implements routes for navigation, authentication, planning, and admin CRUD actions

Supporting logic:
- `Website/forms.py` defines all WTForms used
- A `database.py` module (not shown here, but imported) provides `get_db()` / `close_db()`; likely wraps a SQLite connection with row factory
- `static/` hosts images including uploaded recipe images
- `templates/` holds Jinja templates (not displayed here but referenced)


## Forms

Defined in `forms.py` (fields partially inferred):

| Form | Purpose |
|------|---------|
| `RegForm` | User registration (username + password confirmation) |
| `LogForm` | User login |
| `changePwd` | Change password (likely old/new confirmation) |
| `AddAdminForm` | Promote user to admin |
| `CalorieForm` | Calorie counter input |
| `FilterForm1` | Filter workouts by muscle group |
| `FilterForm2` | Filter recipes by ingredient |
| `addToPlan` | Assign selected workout/recipe to a day |
| `alterRecipes` | Admin create recipe (title, ingredients, instructions, image, calories) |
| `alterWorkouts` | Admin create workout (name, muscle_group_id, description) |
| `ImageUploadForm` | Generic image upload utility (used inside recipe form) |

---

## Routes

(Listed with decorators; some bodies abbreviated in source.)

| Route | Methods | Access | Description |
|-------|---------|--------|-------------|
| `/` | GET/POST | Public | Landing / navigation page |
| `/register` | GET/POST | Public | Register new user |
| `/login` | GET/POST | Public | User login |
| `/loggedout` | GET/POST | Public | Logout page (clears session) |
| `/home` | GET/POST | Auth | Weekly planner dashboard (recipes + workouts + calorie totals) |
| `/calorie_counter` | GET/POST | Auth | Set / update daily calorie goal |
| `/workout` | GET/POST | Auth | List & filter workouts; choose for adding |
| `/confirmworkout` | GET/POST | Auth | Confirm/assign selected workouts to day |
| `/addworkout/<int:workout_id>` | GET | Auth | Stage a workout for planner |
| `/deleteworkout/<int:workout_id>` | GET | Auth | Remove staged workout |
| `/recipes` | GET/POST | Auth | List & filter recipes |
| `/confirmrecipe` | GET/POST | Auth | Confirm/assign selected recipes to day |
| `/addrecipe/<int:food_id>` | GET | Auth | Stage a recipe |
| `/deleterecipe/<int:food_id>` | GET | Auth | Remove staged recipe |
| `/remove_workout/<int:workout_id>/<string:day>` | GET/POST | Auth | Remove workout from a day in planner |
| `/remove_recipe/<int:food_id>/<string:day>` | GET/POST | Auth | Remove recipe from a day in planner |
| `/change_password` | GET/POST | Auth | Change password form |
| `/admin` | GET/POST | Admin | Admin dashboard |
| `/new_recipe` | GET/POST | Admin | Create a recipe (with image upload) |
| `/new_workout` | GET/POST | Admin | Create a workout |
| `/add_admin` | GET/POST | Admin | Promote existing user to admin |

---

## Session Usage

The application uses server-side (filesystem) sessions and stores:
- `user_id`
- `is_admin`
- Filter state: `choice` (workouts), `food_choice` (recipes)
- Temporary selection staging: `workout_ids`, `food_ids`
- `total_cals`: computed dict of calories per day on `/home`
- Possibly `cal` (calorie goal) and `registered` during flow

Because server-side session persists as files, clear them if debugging inconsistent state.

---

## Running the App

```bash
export FLASK_APP=Website.app
export FLASK_ENV=development
# Recommended to override secret key in production:
export SECRET_KEY="change_me"
flask run
```

Then open: http://127.0.0.1:5000/

---

## Usage Walkthrough

1. Register at `/register`
2. Log in at `/login`
3. Visit `/workout` and filter by muscle group; add workouts (staging)
4. Confirm and assign via `/confirmworkout`
5. Visit `/recipes`, filter, and add recipes
6. Assign via `/confirmrecipe`
7. View plan and daily calorie totals at `/home`
8. (Optional) Set calorie target via `/calorie_counter`
9. Admin: log in as `admin` / `123` (FIRST: change password!) → create recipes/workouts
