# Demo project for Microservice implementation
Project to demonstrate .Net Core Microservices architecture using Ocelot as API gateway.
# Project Description
1. The web application is developed with .Net Core 3.4
2. Purpose of application is to demonstrate the architecture adapted for achieving Microservices using Ocelot as a API gateway and each micro services are build with CQRS. 
3. The application is divided in to multiple microservices, each microservice represents a major module of the application.
4. Each microservice has its own database.
5. For asynchronous communication between microservices we used RabbitMQ.
6. Each micorservices contains CRUD operations for their specific module.
# Project Structure

We have Following microservices in the project
API Gateway
   - This microservice acts as a router; it is responsible for providing a unified endpoint to communicate with all the microservices.
   - User requests first interact with this microservice, which decides to which other microservice the request should be routed.
   - The routes folder contains the set of JSON files in which we need to manage the mapping for gateway endpoint and corresponding microservice endpoint.
   - Core : The Core project is responsible for managing the abstraction in the application.
JWT Authorization Manager
    - This microservice is responsible to manage authorization and authentication for the whole application.
Notification Microservice
    - This microservice is responsible to manage all the notifications features in the application.
 S3 Operation Manager
    - This microservice is responsible to manage the upload/download and other AWS operations required in the application.
 There is another project in the application called SharedModule, which is used by RabbitMQ for communication between the microservices.
# Build configuration
    1. Import the project
    2. To run the project we need to select multiple execution operation and run all the projects/microservices.
# Framework details
    1. Each microservice is built using the .Net Core framework with CQRS and MVC
    2. We used Ocelot as an API gateway which is highly recommended.
    3. To asynchronous communication between microservices we used RabbitMQ.
    4. Each microservice has its own database.

     
