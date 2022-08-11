# Pizza Assignment
Full description and requirements are located in `Pizza assignment.pdf`.

## Demos:

https://user-images.githubusercontent.com/39451680/183568959-b0d3cefb-39af-40f2-9deb-c03bd826fb8b.mp4


https://user-images.githubusercontent.com/39451680/183568989-11cb8eb5-7722-4d4c-ac96-14b1f2959db5.mp4


## Installation:
- Prerequisites:
    + Docker
1. Open a terminal at the same path as `docker-compose.yml`.
2. Enter `docker-compose up` and wait for it to finish.
3. The react client should now be available at [`http://localhost:3000`](http://localhost:3000), and the server at [`http://localhost:8080`](http://localhost:8080).

## Usage:
Use the client interface and / or send api requests to the server.

#### Available endpoints:
| URI             	| Method 	| what?                         	            |
|-----------------	|--------	|-------------------------------	            |
| /pizzas         	| POST   	| Submit orders.                 	            |
| /pizzas/batches 	| GET    	| Get completed batches (persisted in the DB).  |
| /pizzas/active  	| GET    	| Get batches still in progress. 	            |

#### Sample data for testing:
Plain Pizza (No toppings) - should take 22 seconds to finish the pipeline:
-  ```json
   [ { "toppings": [] } ]
   ```

Each one of these should take 26 seconds:
1. ```json
   [ { "toppings": ["bacon"] } ]
   ```
2. ```json
   [ { "toppings": ["bacon", "tomato"] } ]
   ```
2. ```json
   [ { "toppings": ["bacon", "tomato", "cheese"] } ]
   ```

Each one of these should take 30 seconds:
1. ```json
   [ { "toppings": ["bacon", "tomato", "cheese", "onion"] } ]
   ```
2. ```json
   [ { "toppings": ["bacon", "tomato", "cheese", "onion", "mushrooms", "pepperoni"] } ]
   ```

Pizza Party - should take 62 seconds:
-  ```json
   [
        { "toppings": ["bacon", "tomato"] },
        { "toppings": ["bacon", "tomato", "cheese", "onion"] },
        { "toppings": ["bacon", "tomato", "cheese", "onion", "mushrooms"] },
        { "toppings": ["bacon", "tomato", "cheese", "onion", "mushrooms", "pepperoni"] },
        { "toppings": ["bacon", "tomato", "cheese", "onion", "mushrooms", "pepperoni", "sausage"] }
   ]
   ```
