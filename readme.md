# Product Management App

This is a simple React application that demonstrates authentication and product management functionalities. It allows users to log in, register, view products, and edit product details if they have admin privileges.

## Features

- **User Authentication**: Users can log in with their username and password or register for a new account.
- **Authorization**: Differentiates between admin and regular users. Only admin users can edit product details.
- **Product Management**: Displays a list of products with their names and prices. Admin users can edit the name and price of each product.

## Technologies Used

- **React**: Frontend JavaScript library for building user interfaces.
- **Express**: Backend web application framework for Node.js.
- **JSON Web Tokens (JWT)**: Used for user authentication and authorization.

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm or yarn: `npm install` or `yarn install`.
4. Start the development server backend: `cd backend & npm start` or `cd backend & yarn start`.
5. Start the development server frontend: `cd frontend & npm start` or `cd frontend & yarn start`.
6. Open your browser and visit `http://localhost:3000` to view the application.
7. If you want to run the tests, use the commands below:
```bash
cd backend
npm test
```
```bash
cd frontend
npm test
```

## Routes

- **POST /login**: Endpoint for user login. Requires a username and password. Returns a JWT token upon successful login.
- **POST /signup**: Endpoint for user registration. Requires a unique username and password. Adds the user to the database upon successful registration.
- **GET /products**: Endpoint for fetching the list of products. Requires a valid JWT token for authorization.
- **PUT /products/:id**: Endpoint for editing product details. Requires an admin user and a valid JWT token for authorization.

## User Permissions

- **Admin Users**: Admin users have the authority to edit product details. They can access the product management functionality by logging in with their admin credentials.
- **Regular Users**: Regular users can view the list of products but cannot edit product details.

## Functionalities

- **Login**: Users can log in with their username and password.
- **Registration**: New users can register for an account with a unique username and password.
- **Product List**: Displays a list of products with their names and prices.
- **Edit Product**: Admin users can edit product details, including the name and price.

## Example of request via curl to the backend

### As admin 
#### Login
```bash
curl http://localhost:5000/login  -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "root"}'
```
Return example

Note: This token is used in other commands
```bash
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzA5MzMyODE0fQ.klY2hNR-gdps8L0BfnmT3o06fBguOvNtfie8xOq_SAQ","username":"admin","group":"admin"}
```

#### Get Products
```bash
curl http://localhost:5000/products  \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzA5MjQzMzIyfQ.dEvKbF9F837zNCKz15ZU0_-ymGv5kyAJPl8rUl2VWZo" \
  -H "Content-Type: application/json" 
```
Return example
```bash
{"products":[{"id":1,"name":"iphone","price":10},{"id":2,"name":"macbook","price":20},{"id":3,"name":"apple vision","price":30}],"group":"admin"}
```

#### Edit Products
```bash
curl -X PUT http://localhost:5000/products/1 \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzA5MjQzMzIyfQ.dEvKbF9F837zNCKz15ZU0_-ymGv5kyAJPl8rUl2VWZo" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Product Name", "price": 25.99}'
  ```
Return example
```bash
{"message":"Product updated successfully"}
 ```

### As regular user 
#### Login
```bash
curl http://localhost:5000/login  -X POST -H "Content-Type: application/json" -d '{"username": "user1", "password": "password1"} '
 ```

Return example
```bash
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWF0IjoxNzA5MzMzMDAyfQ.HX3f5CdVrpbxscJYjSyrYw06CeLUAKmCWLjImgs4BYE","username":"user1","group":"user"}
```
#### Get Products
```bash
curl http://localhost:5000/products  \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWF0IjoxNzA5MjUyNzY0fQ.M0hn_-EVBI6CU3eM4OhpP2DCrwh1G5oeCdrtLxmzwDk" \
  -H "Content-Type: application/json" 
 ```
Return example
```bash
{"products":[{"id":1,"name":"New Product Name","price":25.99},{"id":2,"name":"macbook","price":20},{"id":3,"name":"apple vision","price":30}],"group":"user"}
```
#### Edit Products (without permission)
```bash
curl -X PUT http://localhost:5000/products/1 \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWF0IjoxNzA5MjUyNzY0fQ.M0hn_-EVBI6CU3eM4OhpP2DCrwh1G5oeCdrtLxmzwDk" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Product Name", "price": 25.99}'
```
Return example
```bash
{"error":"Permission denied. Only admin users can edit products."}
```

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push your changes to your fork: `git push origin feature-name`.
5. Submit a pull request to the main repository.

## License

This project is licensed under the [GNU LGPLv3].

