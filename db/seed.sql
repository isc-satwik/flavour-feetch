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