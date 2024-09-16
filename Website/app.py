from flask import Flask, render_template, request, g, session, url_for, redirect, flash, abort
from database import get_db, close_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import LogForm, CalorieForm, RegForm, FilterForm1, FilterForm2, addToPlan, alterRecipes, changePwd, alterWorkouts, AddAdminForm
from werkzeug.utils import secure_filename
import os
from functools import wraps

# Admin ID : admin
# password : 123

methods=["GET","POST"]
app = Flask(__name__)
app.config["SECRET_KEY"] = "hehehe"
app.config['UPLOAD_FOLDER'] = 'static'
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg', 'png'}
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.before_request
def preloads():
    g.user = session.get("user_id", None)
    g.reg = session.get("registered", None)
    g.cal = session.get("cal", None)
    g.choice = session.get("choice", None)
    g.admin = session.get("is_admin", False)
    db = get_db()
    admin_user_id = "admin"
    admin_password = "123"
    admin_exists = db.execute("SELECT * FROM users WHERE user_id = ?", (admin_user_id,)).fetchone()
    if not admin_exists:
        db.execute("INSERT INTO users (user_id, password, is_admin) VALUES (?, ?, ?)",
                   (admin_user_id, generate_password_hash(admin_password), True))
        db.commit()

def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view  

def admin_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        elif not g.admin:
            abort(403)
        return view(*args, **kwargs)
    return wrapped_view

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


app.teardown_appcontext(close_db)

@app.route("/",methods=methods)
def nav():
    return render_template("nav.html")


@app.route("/admin", methods=methods)
@admin_required
def admin():
    return render_template("admin.html")

@app.route("/new_recipe", methods=methods)
@admin_required
def new_recipe():
    form = alterRecipes()
    if form.validate_on_submit():
        title = form.food_title.data
        ingredients = form.ingredients.data
        instructions = form.instructions.data
        calories = form.calories.data
        file = form.image.data
        filename = "generic.jpg"
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        db = get_db()
        db.execute("""
            INSERT INTO recipes (food_title, ingredients, instructions, image, calories)
            VALUES (?, ?, ?, ?, ?)
        """, (title, ingredients, instructions, filename, calories)) 
        db.commit()
        flash("Recipe inserted succesfully!", 'success')
        return redirect(url_for("new_recipe"))  

    return render_template("new_recipe.html", form=form)

@app.route("/new_workout", methods=methods)
@admin_required
def new_workout():
    form = alterWorkouts()
    if form.validate_on_submit():
        workout =  form.workout.data
        muscle_groups = form.muscle_groups.data
        description = form.description.data
        db = get_db()
        db.execute("""
            INSERT INTO workouts (name, muscle_group_id, description)
            VALUES (?, ?, ?)
        """, (workout, muscle_groups, description)) 
        db.commit()
        flash("Workout inserted succesfully!", 'success')
        return redirect(url_for("new_workout"))  

    return render_template("new_workout.html", form=form)

@app.route("/add_admin", methods=methods)
@admin_required
def add_admin():
    form = AddAdminForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password0.data
        db = get_db()
        conflict_user = db.execute("""
                       SELECT * FROM users
                       WHERE user_id = ?;
                       """, (user_id,)).fetchone()
        if conflict_user is not None:
            form.user_id.errors.append("User name already taken")
        else:
            db.execute("""
                        INSERT INTO users (user_id, password, is_admin)
                        VALUES (?, ?,?);
                    """, (user_id, generate_password_hash(password), True))
            db.commit()
            flash('Admin added successfully!', 'success')
            return redirect(url_for('admin'))
    return render_template('add_admin.html', form=form)

@app.route("/register", methods=methods)
def register():
    form = RegForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password0.data
        db = get_db()
        conflict_user = db.execute("""
                       SELECT * FROM users
                       WHERE user_id = ?;
                       """, (user_id,)).fetchone()
        if conflict_user is not None:
            form.user_id.errors.append("User name already taken")
        else:
            db.execute("""
                        INSERT INTO users (user_id, password, is_admin)
                        VALUES (?, ?, ?);
                    """, (user_id, generate_password_hash(password), False))
            db.commit()
            return redirect(url_for("login"))

    return render_template("register.html", form=form)

@app.route("/login", methods=methods)
def login():
    form = LogForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password0.data
        db = get_db()
        user = db.execute("""
                       SELECT * FROM users
                       WHERE user_id = ?;
                       """, (user_id,)).fetchone()
        if user is None:
            form.user_id.errors.append("No such user name! ")
        elif not check_password_hash(user["password"], password):
            form.password0.errors.append("Incorrect password")
        else:
            session["user_id"] = user_id
            session["is_admin"] = bool(user["is_admin"])
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for("nav")
            return redirect(next_page)

    return render_template("login.html", form=form)

@app.route('/change_password', methods=methods)
@login_required
def change_password():
    db = get_db()
    form = changePwd()
    if form.validate_on_submit():
        old_password = form.password.data
        new_password = form.new_password.data
        user = db.execute("""
                       SELECT * FROM users
                       WHERE user_id = ?;
                       """, (g.user,)).fetchone()
        if not check_password_hash(user["password"],old_password):
            form.password.errors.append("Incorrect Original Password")
            return render_template("change_password.html", form=form)
        elif old_password == new_password:
            form.new_password.errors.append("Password cannot be same as previous one")
            return render_template("change_password.html", form=form)
        else:
            db.execute("""
                        UPDATE users
                        SET password = ?
                        WHERE user_id = ?;
                    """, ( generate_password_hash(new_password),g.user))
            db.commit()
            flash("Password changed succesfully!", 'success')
            return redirect(url_for("change_password"))
    return render_template('change_password.html', form=form)

@app.route("/loggedout", methods=methods)
def loggedout():
    session.clear()
    return redirect(url_for("nav"))


@app.route("/calorie_counter", methods=methods)
@login_required
def calorie_counter():
    
    form = CalorieForm()
    calorie_deficit = None
    calorie_surplus = None
    if form.validate_on_submit():
        weight = form.weight.data
        height = form.height.data
        age = form.age.data
        sex = form.sex.data
        activity_level = form.activity_level.data
        goal = form.goal.data
        if "cal" not in session:
            session["cal"] = None
        if sex == "Male":
            bmr = 66 + (6.3 * weight) + (12.9 * height) - (6.8 * age)
        else:
            bmr = 655 + (4.3 * weight) + (4.7 * height) - (4.7 * age)
            
        if activity_level == "Sedentary":
            calories = bmr * 1.2
        elif activity_level == "Lightly active":
            calories = bmr * 1.375
        elif activity_level == "Moderately active":
            calories = bmr * 1.55
        else:
            calories = bmr * 1.725
            
        if goal == "Loose weight":
            calorie_deficit = calories - 500
            session["cal"] = int(calorie_deficit)
        else:
            calorie_surplus = calories + 500
            session["cal"] = int(calorie_surplus)
        session["goal"] = goal
        session.modified = True
        return render_template("calorie_counter.html", form=form, cal=session["cal"])
    return render_template("calorie_counter.html", form=form)

@app.route("/workout",methods=methods)
@login_required
def workout(): 
    form = FilterForm1()
    db = get_db()
    choice = form.filters.data
    if "choice" not in session or session["choice"] == "All":
        workouts = db.execute("""
                    SELECT *
                    FROM workouts;
                    """).fetchall()
    else: 
        workouts = db.execute("""
                    SELECT * 
                    FROM workouts 
                    WHERE muscle_group_id LIKE ?;
                """, ('%' + session["choice"] + '%',)).fetchall()  
    if form.validate_on_submit():
        if "choice" not in session:
            session["choice"] = choice
        else:
            session["choice"] = choice
        session.modified = True
        if session["choice"] == "All":
            workouts = db.execute("""
                SELECT *
                FROM workouts;
                """).fetchall()
        else:
            workouts = db.execute("""
            SELECT * 
            FROM workouts 
            WHERE muscle_group_id LIKE ?;
        """, ('%' + session["choice"] + '%',)).fetchall()
        return render_template("workout.html", workouts=workouts, form=form)
    return render_template("workout.html", workouts=workouts, form=form)



@app.route("/confirmworkout", methods=methods)
@login_required
def confirmworkout():
    db = get_db()
    form = addToPlan()
    names = {}
    muscle_group_ids = {}
    descriptions = {}
    daysOfWeek = db.execute("SELECT name FROM DaysOfWeek").fetchall()
    listD = [day["name"] for day in daysOfWeek]
    listD.insert(0,"Please Select a day")
    form.dow.choices = [day for day in listD]

    if 'workout_ids' not in session:
        session["workout_ids"] = {}

    for workout_id in session["workout_ids"]:
        workout = db.execute("""
                SELECT * FROM workouts WHERE workout_id = ?;
                """, (workout_id,)).fetchone()
        name = workout["name"]
        names[workout_id] = name
        muscle_group_id = workout["muscle_group_id"]
        muscle_group_ids[workout_id] = muscle_group_id
        description = workout["description"]
        descriptions[workout_id] = description

    if form.validate_on_submit():
        selected_day = form.dow.data
        selected_workout_id = request.form.get('selected_workout_id')
        if selected_day == "Please Select a day":
            flash("Select a valid day!","errors")
            return redirect(url_for("confirmworkout"))
        else:
            existing_plan = db.execute("""
                SELECT * FROM planner
                WHERE user_id = ? AND days = ? AND workout_id = ?
            """, (g.user, selected_day, selected_workout_id)).fetchone()
            if existing_plan:
                flash("Workout already added to your plan for this day!","errors")
                return redirect(url_for("confirmworkout"))
            else:
                db.execute("""
                    INSERT INTO planner (user_id, days, workout_id)
                    VALUES (?, ?, ?)
                """, (g.user, selected_day, selected_workout_id))
                flash("Workout succesfully added!","errors")
                db.commit()     
                return redirect(url_for("confirmworkout"))
    return render_template("confirmworkout.html", workout_ids=session['workout_ids'], names=names, muscle_group_ids = muscle_group_ids, descriptions=descriptions,form=form)

@app.route("/addworkout/<int:workout_id>")
@login_required
def addworkout(workout_id):
    if "workout_ids" not in session:
        session["workout_ids"] = {}

    if workout_id not in session["workout_ids"]:
        session["workout_ids"][workout_id] = 1
        flash("Workout succesfully added!","success")
    else:
        flash("Workout already added to your session!", 'error')
    session.modified = True
    return redirect(url_for("workout"))

@app.route("/deleteworkout/<int:workout_id>")
@login_required
def deleteworkout(workout_id):
    if workout_id in session["workout_ids"]:
        del session["workout_ids"][workout_id]
    session.modified = True
    return redirect(url_for("confirmworkout"))

@app.route("/recipes",methods=methods)
@login_required
def recipes(): 
    form = FilterForm2()
    db = get_db()
    food_choice = form.filters.data
    if "food_choice" not in session or session["food_choice"] == "All":
        recipes = db.execute("""
                    SELECT *
                    FROM recipes;
                    """).fetchall()
    else: 
        recipes = db.execute("""
                    SELECT * 
                    FROM recipes 
                    WHERE ingredients LIKE ?;
                """, ('%' + session["food_choice"] + '%',)).fetchall()  
    if form.validate_on_submit():
        if "food_choice" not in session:
            session["food_choice"] = food_choice
        else:
            session["food_choice"] = food_choice
        session.modified = True
        if session["food_choice"] == "All":
            recipes = db.execute("""
                SELECT *
                FROM recipes;
                """).fetchall()
        else:
            recipes = db.execute("""
            SELECT * 
            FROM recipes 
            WHERE ingredients LIKE ?;
        """, ('%' + session["food_choice"] + '%',)).fetchall()
        return render_template("recipes.html", recipes=recipes, form=form)
    return render_template("recipes.html", recipes=recipes, form=form)

@app.route("/confirmrecipe", methods=methods)
@login_required
def confirmrecipe():
    db = get_db()
    form = addToPlan()
    daysOfWeek = db.execute("SELECT name FROM DaysOfWeek").fetchall()
    listD = [day["name"] for day in daysOfWeek]
    listD.insert(0,"Please Select a day")
    form.dow.choices = [day for day in listD] 
    if 'food_ids' not in session:
        session["food_ids"] = {}
    names = {}
    ingredients = {}
    instructions = {}
    images = {}
    calories = {}
    for food_id in session["food_ids"]:
        recipes = db.execute("""
                SELECT * FROM recipes WHERE food_id = ?;
                """, (food_id,)).fetchone()
        name = recipes["food_title"]
        names[food_id] = name
        ingredient = recipes["ingredients"]
        ingredients[food_id] = ingredient
        instruction = recipes["instructions"]
        instructions[food_id] = instruction
        image = recipes["image"]
        images[food_id] = image
        calorie = recipes["calories"]
        calories[food_id] = calorie
    if form.validate_on_submit():
        selected_day = form.dow.data
        selected_food_id = request.form.get('selected_food_id')
        if selected_day == "Please Select a day":
            flash("Select a valid day","errors")
            return redirect(url_for("confirmrecipe"))
        else:
            existing_plan = db.execute("""
                SELECT * FROM planner
                WHERE user_id = ? AND days = ? AND food_id = ?
            """, (g.user, selected_day, selected_food_id)).fetchone()
            if existing_plan:
                flash("Meal already added to your plan for this day!","error")
                return redirect(url_for("confirmrecipe"))
            else:
                db.execute("""
                    INSERT INTO planner (user_id, days, food_id)
                    VALUES (?, ?, ?)
                """, (g.user, selected_day, selected_food_id))
                flash("Meal succesfully added!","success")
                db.commit()     
                return redirect(url_for("confirmrecipe"))
    return render_template("confirmrecipe.html", food_ids=session['food_ids'], calories=calories,names=names, instructions = instructions, ingredients=ingredients,form=form, images=images)


@app.route("/addrecipe/<int:food_id>")
@login_required
def addrecipe(food_id):
    if "food_ids" not in session:
        session["food_ids"] = {}

    if food_id not in session["food_ids"]:
        session["food_ids"][food_id] = 1
        flash("Meal succesfully added to session!","success")
    else:
        flash("This meal was already added to your session!", 'error')
    session.modified = True
    return redirect(url_for("recipes"))

@app.route("/deleterecipe/<int:food_id>")
@login_required
def deleterecipe(food_id):
    if food_id in session["food_ids"]:
        del session["food_ids"][food_id]
    session.modified = True
    return redirect(url_for("confirmrecipe"))


@app.route("/home", methods=methods)
@login_required
def home():
    db = get_db()
    weekdays = db.execute("SELECT name FROM DaysOfWeek").fetchall()
    workouts_chosen = db.execute("""
        SELECT planner.*, workouts.name, workouts.muscle_group_id, workouts.description
        FROM planner JOIN workouts ON planner.workout_id = workouts.workout_id
        WHERE user_id = ?;
    """, (g.user,)).fetchall()
    recipes_chosen = db.execute("""
        SELECT planner.*, recipes.food_title, recipes.ingredients, recipes.instructions, recipes.image, recipes.calories
        FROM planner JOIN recipes ON planner.food_id = recipes.food_id
        WHERE user_id = ?;
    """, (g.user,)).fetchall()
    total_calories_per_day = {}
    for recipe in recipes_chosen:
        day = recipe["days"]
        if day in total_calories_per_day:
            total_calories_per_day[day] += recipe["calories"]
        else:
            total_calories_per_day[day] = recipe["calories"]
    session["total_cals"] = total_calories_per_day
    session.modified = True

    return render_template("home.html", weekdays=weekdays, workouts_chosen=workouts_chosen, recipes_chosen=recipes_chosen, total_calories_per_day=session["total_cals"])


@app.route("/remove_workout/<int:workout_id>/<string:day>", methods=methods)
@login_required
def remove_workout(workout_id, day):
    db = get_db()
    db.execute("DELETE FROM planner WHERE workout_id = ? AND days = ? AND user_id = ?", (workout_id, day, g.user))
    db.commit()
    return redirect(url_for("home"))

@app.route("/remove_recipe/<int:food_id>/<string:day>", methods=methods)
@login_required
def remove_recipe(food_id, day):
    db = get_db()
    db.execute("DELETE FROM planner WHERE food_id = ? AND days = ? AND user_id = ?", (food_id, day, g.user))
    db.commit()
    return redirect(url_for("home"))




# file uploads info taken and altered from https://blog.miguelgrinberg.com/post/handling-file-uploads-with-flask