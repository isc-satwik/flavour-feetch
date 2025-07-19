-- Ingredients
INSERT INTO ingredients (name, unit) VALUES
('Rice', 'grams'),
('Chicken', 'grams'),
('Yogurt', 'grams'),
('Spices', 'grams'),
('Onion', 'grams'),
('Tomato', 'grams'),
('Cheese', 'grams'),
('Flour', 'grams'),
('Yeast', 'grams'),
('Bell Pepper', 'grams'),
('Paneer', 'grams'),
('Vegetables', 'grams');

-- Dishes
INSERT INTO dishes (name, description, image_url, default_servings) VALUES
('Biryani', 'A flavorful rice dish with spices and meat or vegetables.', NULL, 4),
('Pizza', 'Classic Italian pizza with cheese and toppings.', NULL, 2),
('Pulav', 'A mild rice dish with vegetables or meat.', NULL, 4);

-- Dish_Ingredients for Biryani (dish_id = 1)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES
(1, 1, 100),  -- Rice
(1, 2, 75),   -- Chicken
(1, 3, 30),   -- Yogurt
(1, 4, 10),   -- Spices
(1, 5, 20),   -- Onion
(1, 6, 15);   -- Tomato

-- Dish_Ingredients for Pizza (dish_id = 2)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES
(2, 8, 100),  -- Flour
(2, 9, 5),    -- Yeast
(2, 7, 50),   -- Cheese
(2, 10, 20),  -- Bell Pepper
(2, 5, 10);   -- Onion

-- Dish_Ingredients for Pulav (dish_id = 3)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES
(3, 1, 90),   -- Rice
(3, 12, 50),  -- Vegetables
(3, 5, 15),   -- Onion
(3, 6, 10),   -- Tomato
(3, 4, 5);    -- Spices 

-- Additional Ingredients
INSERT IGNORE INTO ingredients (name, unit) VALUES
('Potato', 'grams'),
('Paneer', 'grams'),
('Pasta', 'grams'),
('Tomato Sauce', 'grams'),
('Lettuce', 'grams'),
('Cucumber', 'grams'),
('Tortilla', 'pieces'),
('Beef Patty', 'grams'),
('Chicken Breast', 'grams'),
('Egg', 'pieces'),
('Cheddar Cheese', 'grams'),
('Mayonnaise', 'grams'),
('Mustard', 'grams'),
('Carrot', 'grams'),
('Onion Rings', 'grams'),
('Avocado', 'grams'),
('Corn', 'grams'),
('Beans', 'grams'),
('Chutney', 'grams');

-- Additional Dishes
INSERT INTO dishes (name, description, image_url, default_servings) VALUES
('Dosa', 'Crispy South Indian rice pancake.', NULL, 2),
('Pasta', 'Classic Italian pasta with sauce.', NULL, 2),
('Burger', 'Juicy burger with cheese and veggies.', NULL, 1),
('Salad', 'Fresh mixed vegetable salad.', NULL, 2),
('Tacos', 'Mexican tacos with fillings.', NULL, 2);

-- Dish_Ingredients for Dosa (dish_id = 4)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES
(4, 1, 60),    -- Rice
(4, 11, 40),   -- Potato
(4, 20, 20),   -- Chutney
(4, 5, 10);    -- Onion

-- Dish_Ingredients for Pasta (dish_id = 5)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES
(5, 13, 80),   -- Pasta
(5, 6, 30),    -- Tomato
(5, 14, 40),   -- Tomato Sauce
(5, 7, 30),    -- Cheese
(5, 5, 10);    -- Onion

-- Dish_Ingredients for Burger (dish_id = 6)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES
(6, 15, 100),  -- Beef Patty
(6, 7, 30),    -- Cheese
(6, 16, 20),   -- Lettuce
(6, 17, 20),   -- Cucumber
(6, 18, 1),    -- Egg
(6, 19, 20),   -- Mayonnaise
(6, 5, 10);    -- Onion

-- Dish_Ingredients for Salad (dish_id = 7)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES
(7, 16, 30),   -- Lettuce
(7, 17, 30),   -- Cucumber
(7, 21, 30),   -- Carrot
(7, 5, 10),    -- Onion
(7, 22, 20),   -- Onion Rings
(7, 23, 30),   -- Avocado
(7, 24, 30);   -- Corn

-- Dish_Ingredients for Tacos (dish_id = 8)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES
(8, 25, 1),    -- Tortilla
(8, 26, 60),   -- Chicken Breast
(8, 27, 40),   -- Beans
(8, 6, 20),    -- Tomato
(8, 7, 20),    -- Cheese
(8, 23, 20);   -- Avocado 