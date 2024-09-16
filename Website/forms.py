from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, FloatField, IntegerField, SelectField,RadioField
from wtforms.validators import InputRequired,  EqualTo, NoneOf, Optional
from flask_wtf.file import FileField, FileAllowed
from wtforms.validators import DataRequired

class ImageUploadForm(FlaskForm):
    image = FileField('Image', validators=[DataRequired(), FileAllowed(['jpg', 'png', 'jpeg'])])
    
class RegForm(FlaskForm):
    user_id = StringField("User Id:",validators=[InputRequired(message="Please enter your username")])
    password0 = PasswordField("Password:",validators=[InputRequired(message="Please enter a passsword")])
    password1 = PasswordField("Re-enter Password:",validators=[EqualTo("password0", message="Passwords must match"), InputRequired()] )
    submit = SubmitField("Submit")

class LogForm(FlaskForm):
    user_id = StringField("User Id:",validators=[InputRequired(message="Please enter your username")])
    password0 = PasswordField("Password:",validators=[InputRequired(message="Please enter a passsword")])
    submit = SubmitField("Submit")

class changePwd(FlaskForm):
    password = PasswordField("Password:",validators=[InputRequired(message="Please enter your orignal passsword")])
    new_password = PasswordField("Password:",validators=[InputRequired(message="Please enter a new passsword")])
    new_password0 = PasswordField("Re-enter Password:",validators=[EqualTo("new_password", message="Passwords must match"), InputRequired()] )
    submit = SubmitField("Submit")

class AddAdminForm(FlaskForm):
    user_id = StringField('Username', validators=[InputRequired()])
    password0 = PasswordField('Password', validators=[InputRequired()])
    password1 = PasswordField("Re-enter Password:",validators=[EqualTo("password0", message="Passwords must match"), InputRequired()] )
    submit = SubmitField('Add Admin')

class CalorieForm(FlaskForm):
    weight = FloatField(validators=[InputRequired(message="Field required")])
    height = FloatField(validators=[InputRequired(message="Field required")])
    age = IntegerField(validators=[InputRequired(message="Field required")])
    sex = SelectField('Sex', choices=["Choose Sex", "Male", "Female"], default='Choose Sex',  validators=[NoneOf("Choose Sex",message="Choose a Valid Option")])
    activity_level = SelectField('Activity level', choices=['Select Activity level', 'Sedentary', 'Lightly active', 'Moderately active','Very active'], default='Select Activity level', validators=[NoneOf("Select Activity level",message="Choose a Valid Option")])
    goal = SelectField('Goal', choices=['Your Goal','Loose weight', 'Gain weight'], default='Your Goal',  validators=[NoneOf("Your Goal",message="Choose a Valid Option")])
    submit = SubmitField("Submit")


class FilterForm1(FlaskForm):
    filters = RadioField(choices=["All","Chest","Shoulders","Triceps","Quadriceps","Hamstrings","Glutes","Back","Biceps","Core","Full Body","Lower Back","Calves","Forearms",])
    submit = SubmitField("Submit")

    
class addToPlan(FlaskForm):
    dow = SelectField(choices=[])
    submit1 = SubmitField("Add To Plan")

class alterRecipes(FlaskForm):
    food_title = StringField("Name of recipe:", validators=[InputRequired("Enter a title")])
    ingredients = StringField("Ingredients:", validators=[InputRequired("Enter ingredients required")])
    instructions = StringField("Instructions:", validators=[InputRequired("Enter Instructions")])
    calories = IntegerField("Calories:", validators=[InputRequired("Enter calorific quantity of meal")])
    image = FileField('Image', validators=[Optional(), FileAllowed(['jpg', 'png', 'jpeg'])])
    submit = SubmitField("Submit")

class alterWorkouts(FlaskForm):
    workout = StringField("Name of recipe:",validators=[InputRequired("Enter a title")])
    muscle_groups = StringField("Ingredients:",validators=[InputRequired("Enter muscle groups targetted")])
    description = StringField("Instructions",validators=[InputRequired("Enter workout description")])
    submit = SubmitField("Submit")

class FilterForm2(FlaskForm):
    filters = RadioField(choices=["All","Tomatoes",
    "Fresh mozzarella",
    "Fresh basil",
    "Balsamic glaze",
    "Salt",
    "Pepper",
    "Bread",
    "Avocado",
    "Lemon juice",
    "Red pepper flakes",
    "Quinoa",
    "Cucumber",
    "Cherry tomatoes",
    "Red onion",
    "Feta cheese",
    "Olive oil",
    "Chicken breast",
    "Bell peppers",
    "Broccoli",
    "Carrots",
    "Soy sauce",
    "Garlic",
    "Ginger",
    "Sesame oil",
    "Cornstarch",
    "Lettuce leaves",
    "Mustard",
    "Turkey breast",
    "Cheese slices",
    "Celery",
    "Vegetable broth",
    "Canned tomatoes",
    "Green beans",
    "Corn",
    "Peas",
    "Thyme",
    "Bay leaf",
    "Shrimp",
    "Pasta",
    "Spinach",
    "Parmesan cheese",
    "Chickpeas",
    "Kalamata olives",
    "Oregano",
    "Ground beef",
    "Rice",
    "Worcestershire sauce",
    "Italian seasoning",
    "Mozzarella cheese",
    "Garlic powder",
    "Onion powder",
    "Paprika",
    "Broccoli florets"
    ])
    submit = SubmitField("Submit")
