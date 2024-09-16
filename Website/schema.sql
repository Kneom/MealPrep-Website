DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    is_admin BOOLEAN
);
DROP TABLE IF EXISTS DaysOfWeek;
CREATE TABLE DaysOfWeek (
    name TEXT NOT NULL
);
INSERT INTO DaysOfWeek (name) VALUES
    ('Monday'),
    ('Tuesday'),
    ('Wednesday'),
    ('Thursday'),
    ('Friday'),
    ('Saturday'),
    ('Sunday');

DROP TABLE IF EXISTS workouts;
CREATE TABLE workouts (
    workout_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    muscle_group_id TEXT NOT NULL,
    description TEXT
);

INSERT INTO workouts (name, muscle_group_id, description) VALUES 
('Push-ups', 'Chest, Shoulders, Triceps', 'Push-ups are a bodyweight exercise that primarily targets the chest, shoulders, and triceps. Begin in a plank position with your hands shoulder-width apart, lower your body until your chest nearly touches the floor, then push back up to the starting position.'),
('Squats', 'Quadriceps, Hamstrings, Glutes', 'Squats are a fundamental lower-body exercise that targets the quadriceps, hamstrings, and glutes. Start with your feet shoulder-width apart, squat down by bending your knees and hips, then return to the standing position.'),
('Pull-ups', 'Back, Biceps', 'Pull-ups are a challenging bodyweight exercise that targets the back and biceps. Hang from a pull-up bar with your palms facing away from you, pull your body up until your chin is above the bar, then lower yourself back down.'),
('Deadlifts', 'Back, Hamstrings, Glutes', 'Deadlifts are a compound exercise that targets the lower back, hamstrings, and glutes. Begin with a barbell on the floor, stand with your feet hip-width apart, hinge at the hips to lower your torso, then lift the barbell by straightening your hips and knees.'),
('Planks', 'Core', 'Planks are a core-strengthening exercise that targets the abdominal muscles. Start in a push-up position, with your weight supported by your forearms and toes, keep your body in a straight line from head to heels, hold for a set amount of time.'),
('Lunges', 'Quadriceps, Hamstrings, Glutes', 'Lunges are a lower-body exercise that targets the quadriceps, hamstrings, and glutes. Stand with your feet hip-width apart, step forward with one leg, lower your body until both knees are bent at a 90-degree angle, then push back to the starting position.'),
('Bench Press', 'Chest, Shoulders, Triceps', 'The bench press is a compound exercise that primarily targets the chest, shoulders, and triceps. Lie on a flat bench with a barbell, lower the barbell to your chest, then press it back up to the starting position.'),
('Bent Over Rows', 'Back, Biceps', 'Bent over rows are a back-strengthening exercise that targets the back and biceps. Hold a barbell or dumbbells with an overhand grip, bend at the hips until your torso is nearly parallel to the floor, then pull the weight towards your lower chest, squeezing your shoulder blades together.'),
('Shoulder Press', 'Shoulders, Triceps', 'The shoulder press is a shoulder-strengthening exercise that targets the deltoid muscles. Hold a barbell or dumbbells at shoulder height, press the weight overhead until your arms are fully extended, then lower it back down to shoulder height.'),
('Bicep Curls', 'Biceps', 'Bicep curls are an isolation exercise that targets the biceps. Hold dumbbells at your sides with your palms facing forward, curl the weights towards your shoulders while keeping your upper arms stationary, then lower them back down to the starting position.'),
('Tricep Dips', 'Triceps', 'Tricep dips are a bodyweight exercise that primarily targets the triceps. Position yourself on parallel bars or a sturdy elevated surface, lower your body by bending your elbows until they are at a 90-degree angle, then push back up to the starting position.'),
('Russian Twists', 'Core', 'Russian twists are a core-strengthening exercise that targets the obliques. Sit on the floor with your knees bent and feet lifted, lean back slightly, and rotate your torso to the left, then to the right, while holding a weight or clasping your hands together.'),
('Burpees', 'Full Body', 'Burpees are a full-body exercise that combines a squat, plank, push-up, and jump. Begin in a standing position, squat down, kick your feet back into a plank, perform a push-up, jump your feet back to your hands, and then explode upward into a jump.'),
('Leg Press', 'Quadriceps, Hamstrings, Glutes', 'The leg press is a compound exercise that primarily targets the quadriceps, hamstrings, and glutes. Sit on the leg press machine, place your feet shoulder-width apart on the platform, push the platform away by extending your knees, and then return to the starting position.'),
('Dumbbell Shoulder Flyes', 'Shoulders', 'Dumbbell shoulder flyes are a shoulder-strengthening exercise that primarily targets the deltoid muscles. Hold a pair of dumbbells at your sides with your palms facing in, raise your arms out to the sides until they are parallel to the floor, then lower them back down.'),
('Romanian Deadlifts', 'Hamstrings, Glutes, Lower Back', 'Romanian deadlifts are a variation of the traditional deadlift that targets the hamstrings, glutes, and lower back. Hold a barbell or dumbbells in front of your thighs, hinge at the hips to lower the weight towards the floor, keeping your back flat, and then return to the starting position by squeezing your glutes and driving your hips forward.'),
('Calf Raises', 'Calves', 'Calf raises are a calf-strengthening exercise that targets the calf muscles. Stand with your feet hip-width apart on a raised surface, such as a step or calf raise machine, push through the balls of your feet to raise your heels as high as possible, then lower them back down.'),
('Russian Deadlifts', 'Hamstrings, Glutes, Lower Back', 'Russian deadlifts are a variation of the traditional deadlift that targets the hamstrings, glutes, and lower back. Stand with your feet shoulder-width apart, hold a barbell or dumbbells in front of your thighs, hinge at the hips to lower the weight towards the floor while keeping your back flat, and then return to the starting position by squeezing your glutes and driving your hips forward.'),
('Bicycle Crunches', 'Core', 'Bicycle crunches are a core-strengthening exercise that targets the abdominal muscles and obliques. Lie on your back with your hands behind your head, lift your legs off the ground and bend your knees, bring your right elbow towards your left knee while straightening your right leg, then switch sides in a pedaling motion.'),
('Hammer Curls', 'Biceps, Forearms', 'Hammer curls are a variation of the traditional bicep curl that also targets the forearms. Hold dumbbells at your sides with your palms facing in towards your body, curl the weights towards your shoulders while keeping your palms facing in, then lower them back down to the starting position.'),
('Dumbbell Lunges', 'Quadriceps, Hamstrings, Glutes', 'Dumbbell lunges are a lower-body exercise that targets the quadriceps, hamstrings, and glutes. Hold a pair of dumbbells at your sides, step forward with one leg and lower your body until both knees are bent at a 90-degree angle, then push back to the starting position.'),
('Lat Pulldowns', 'Back, Biceps', 'Lat pulldowns are a back-strengthening exercise that targets the latissimus dorsi muscles and biceps. Sit at a lat pulldown machine with your knees securely under the pad, grip the bar with your hands slightly wider than shoulder-width apart, pull the bar down to your chest, then slowly release it back up to the starting position.'),
('Plank to Push-up', 'Core, Chest, Shoulders, Triceps', 'Plank to push-up is a dynamic exercise that targets the core, chest, shoulders, and triceps. Begin in a plank position with your hands directly under your shoulders, lower yourself down into a push-up, and then press back up into the plank position.'),
('Jumping Jacks', 'Full Body', 'Jumping jacks are a full-body exercise that improves cardiovascular fitness and coordination. Start with your feet together and arms at your sides, jump while spreading your legs shoulder-width apart and raising your arms overhead, then return to the starting position in one fluid motion.');

DROP TABLE IF EXISTS planner;
CREATE TABLE planner(
    days TEXT NULL,
    user_id TEXT NULL,
    workout_id TEXT NULL,
    food_id TEXT NULL
);

-- recipes and workouts generated by chatGpt

DROP TABLE IF EXISTS recipes;
CREATE TABLE recipes (
    food_id INTEGER PRIMARY KEY AUTOINCREMENT,
    food_title TEXT,
    ingredients TEXT,
    instructions TEXT,
    image BLOB DEFAULT 'generic.jpg',
    calories INTEGER
);

INSERT INTO recipes (food_title, ingredients, instructions, image, calories) VALUES 
('Caprese Salad', 'Tomatoes, fresh mozzarella, fresh basil, balsamic glaze, salt, pepper', '1. Slice tomatoes and fresh mozzarella. 2. Arrange tomato and mozzarella slices on a plate, alternating with fresh basil leaves. 3. Drizzle with balsamic glaze. 4. Season with salt and pepper to taste.', 'caprese_salad.jpg', 250),
('Avocado Toast', 'Bread, avocado, lemon juice, salt, pepper, red pepper flakes', '1. Toast bread until golden brown. 2. Mash avocado with lemon juice, salt, and pepper. 3. Spread avocado mixture on toasted bread. 4. Sprinkle with red pepper flakes.', 'avo_toast.jpg', 350),
('Quinoa Salad', 'Quinoa, cucumber, cherry tomatoes, red onion, feta cheese, olive oil, lemon juice, salt, pepper', '1. Cook quinoa according to package instructions and let cool. 2. Chop cucumber, cherry tomatoes, and red onion. 3. Mix quinoa with chopped vegetables and crumbled feta cheese. 4. Dress with olive oil, lemon juice, salt, and pepper. 5. Serve chilled.', 'q_salad.jpg', 300),
('Chicken Stir-Fry', 'Chicken breast, bell peppers, broccoli, carrots, soy sauce, garlic, ginger, sesame oil, cornstarch', '1. Slice chicken breast into strips and marinate in soy sauce, garlic, ginger, and sesame oil. 2. Heat a pan over medium heat and stir-fry chicken until cooked through. 3. Add chopped bell peppers, broccoli, and carrots to the pan. 4. Cook until vegetables are tender. 5. Mix cornstarch with water to create a slurry, then pour over the stir-fry to thicken the sauce. 6. Serve hot over rice or noodles.', 'c_s_f.jpg', 400),
('Turkey and Cheese Roll-Ups', 'Sliced turkey breast, cheese slices, lettuce leaves, mustard', '1. Lay a slice of turkey breast flat and place a slice of cheese on top. 2. Spread mustard on one edge of the turkey slice. 3. Place a lettuce leaf on top of the mustard. 4. Roll up the turkey slice tightly, starting from the edge with the mustard. 5. Repeat with remaining turkey slices. 6. Serve as a snack or light meal.', 't_c.jpg', 200),
('Vegetable Soup', 'Carrots, celery, onion, garlic, vegetable broth, canned tomatoes, green beans, corn, peas, thyme, bay leaf', '1. Chop carrots, celery, and onion. 2. Sauté garlic, carrots, celery, and onion in a pot until softened. 3. Add vegetable broth, canned tomatoes, green beans, corn, peas, thyme, and bay leaf to the pot. 4. Simmer for about 20 minutes, until vegetables are tender. 5. Season with salt and pepper to taste. 6. Serve hot.', 'veg_soup.jpg', 150),
('Shrimp Pasta', 'Shrimp, pasta, olive oil, garlic, cherry tomatoes, spinach, lemon juice, red pepper flakes, Parmesan cheese', '1. Cook pasta according to package instructions and set aside. 2. Heat olive oil in a pan and sauté minced garlic until fragrant. 3. Add shrimp to the pan and cook until pink. 4. Add halved cherry tomatoes and spinach to the pan, and cook until spinach wilts. 5. Toss cooked pasta with the shrimp mixture. 6. Season with lemon juice, red pepper flakes, and grated Parmesan cheese. 7. Serve hot.', 'shrimp.jpg', 450),
('Mediterranean Chickpea Salad', 'Chickpeas, cucumber, cherry tomatoes, red onion, feta cheese, Kalamata olives, olive oil, lemon juice, garlic, oregano, salt, pepper', '1. Rinse and drain canned chickpeas. 2. Chop cucumber, cherry tomatoes, red onion, and Kalamata olives. 3. Combine chickpeas, chopped vegetables, and crumbled feta cheese in a bowl. 4. In a separate bowl, whisk together olive oil, lemon juice, minced garlic, oregano, salt, and pepper to make the dressing. 5. Pour the dressing over the salad and toss to coat. 6. Serve chilled.', 'medcp.jpg', 300),
('Stuffed Bell Peppers', 'Bell peppers, ground beef, rice, onion, garlic, canned tomatoes, tomato sauce, Worcestershire sauce, Italian seasoning, salt, pepper, mozzarella cheese', '1. Cut the tops off bell peppers and remove seeds. 2. In a skillet, cook ground beef, onion, and garlic until browned. 3. Add cooked rice, canned tomatoes, tomato sauce, Worcestershire sauce, Italian seasoning, salt, and pepper to the skillet. 4. Stir to combine and cook until heated through. 5. Stuff bell peppers with the beef and rice mixture. 6. Top with shredded mozzarella cheese. 7. Bake in the oven until peppers are tender and cheese is melted. 8. Serve hot.', 'sbp.jpg', 350),
('Broccoli and Cheese Stuffed Chicken', 'Chicken breasts, broccoli florets, cheddar cheese, garlic powder, onion powder, paprika, salt, pepper', '1. Preheat oven to 375°F (190°C). 2. Pound chicken breasts to an even thickness. 3. Season chicken with garlic powder, onion powder, paprika, salt, and pepper. 4. Steam broccoli florets until tender. 5. Place cooked broccoli and shredded cheddar cheese on one half of each chicken breast. 6. Fold the other half of the chicken breast over the filling and secure with toothpicks. 7. Bake in the preheated oven for about 25-30 minutes, until chicken is cooked through. 8. Serve hot.', 'bcb.jpg', 400),
('Greek Yogurt Parfait', 'Greek yogurt, granola, berries, honey', '1. Layer Greek yogurt, granola, and berries in a glass or bowl. 2. Drizzle with honey. 3. Repeat layers until the container is filled. 4. Serve immediately.', 'greek.jpg', 250),
('Tuna Salad Wrap', 'Canned tuna, mayonnaise, celery, red onion, pickles, lettuce leaves, tortillas', '1. Drain canned tuna and place in a bowl. 2. Add mayonnaise, chopped celery, chopped red onion, and chopped pickles to the bowl. 3. Mix until well combined. 4. Lay a lettuce leaf on a tortilla. 5. Spoon tuna salad onto the lettuce leaf. 6. Roll up the tortilla tightly. 7. Slice in half and serve.', 'tunawrap.jpg', 300),
('Vegetarian Chili', 'Kidney beans, black beans, diced tomatoes, onion, bell pepper, garlic, chili powder, cumin, paprika, salt, pepper', '1. Chop onion, bell pepper, and garlic. 2. Sauté onion, bell pepper, and garlic in a pot until softened. 3. Add canned kidney beans, black beans, and diced tomatoes to the pot. 4. Stir in chili powder, cumin, paprika, salt, and pepper. 5. Simmer for about 30 minutes, until flavors are blended. 6. Serve hot with optional toppings like shredded cheese, sour cream, or chopped green onions.', 'v_chilli.jpg', 300),
('Egg Salad Sandwich', 'Hard-boiled eggs, mayonnaise, mustard, celery, green onions, salt, pepper, bread', '1. Chop hard-boiled eggs and place in a bowl. 2. Add mayonnaise, mustard, chopped celery, and sliced green onions to the bowl. 3. Season with salt and pepper. 4. Mix until well combined. 5. Spread egg salad on bread slices to make sandwiches. 6. Serve chilled or at room temperature.', 'eggsalad.jpg', 350),
('Mushroom Risotto', 'Arborio rice, mushrooms, onion, garlic, vegetable broth, white wine, Parmesan cheese, butter, olive oil, salt, pepper', '1. Sauté chopped onion and minced garlic in olive oil and butter until softened. 2. Add sliced mushrooms to the pan and cook until browned. 3. Stir in Arborio rice and cook for a few minutes until translucent. 4. Deglaze the pan with white wine, stirring until absorbed. 5. Gradually add vegetable broth to the rice mixture, stirring frequently, until the rice is creamy and cooked through. 6. Stir in grated Parmesan cheese, salt, and pepper. 7. Serve hot.', 'mushris.jpg', 400),
('Hummus and Veggie Wrap', 'Whole wheat tortilla, hummus, cucumber, bell pepper, carrot, lettuce leaves', '1. Spread hummus evenly over a whole wheat tortilla. 2. Layer sliced cucumber, bell pepper, carrot, and lettuce leaves on top of the hummus. 3. Roll up the tortilla tightly. 4. Slice in half and serve.', 'hv.jpg', 200),
('Cauliflower Fried Rice', 'Cauliflower, eggs, onion, garlic, carrots, peas, soy sauce, sesame oil, green onions', '1. Pulse cauliflower florets in a food processor until they resemble rice. 2. Sauté chopped onion and minced garlic in a pan until softened. 3. Add riced cauliflower to the pan and cook until tender. 4. Push cauliflower to one side of the pan and crack eggs into the other side. 5. Scramble eggs until cooked through, then mix with the cauliflower. 6. Stir in diced carrots, peas, soy sauce, and sesame oil. 7. Cook until vegetables are heated through. 8. Garnish with sliced green onions and serve hot.', 'cfd.jpg', 250),
('Peanut Butter Banana Smoothie', 'Banana, peanut butter, milk, honey, ice cubes', '1. Place peeled banana, peanut butter, milk, honey, and ice cubes in a blender. 2. Blend until smooth and creamy. 3. Pour into glasses and serve immediately.', 'pb.jpg', 300),
('Tofu Stir-Fry', 'Tofu, bell peppers, broccoli, carrots, soy sauce, garlic, ginger, sesame oil, cornstarch', '1. Press tofu to remove excess moisture, then cut into cubes. 2. Marinate tofu in soy sauce, garlic, ginger, and sesame oil. 3. Heat a pan over medium heat and stir-fry tofu until golden brown. 4. Add chopped bell peppers, broccoli, and carrots to the pan. 5. Cook until vegetables are tender. 6. Mix cornstarch with water to create a slurry, then pour over the stir-fry to thicken the sauce. 7. Serve hot over rice or noodles.', 'tfs.jpg', 350);

-- images taken from unsplash.com and pexels.com