# Demo project for CQRS and MVC
Project to demonstrate .Net Core CQRS with MVC
# Project Description
1. The web application is developed with .Net Core 3.4
2. Purpose of application is to demonstrate the architecture adapted for CQRS and MVC.
3. The application contains 2 major entities Members and Tasks.
4. The application contains CRUD operations for Members and Tasks and also contains logic co assign tasks to members.
# Project Structure
1. The application is configured with 7 projects those are
We have 2 main projects WebAPI and WebClient those are the entry points for the application
The WebAPI project 
    - Core : The Core project is responsible for managing the abstraction in the application.
    It contains the declaration of required reposetories interfaces.
    - DataLayer : The DataLayer project is responsible for managing the database context and data context management.
    - Domain : The Domain project is responsible for managing the models required for showing data on UI. Apart from that it also contains folders for Queries and commands for performing Crud operations.
    - Services : The Services project is responsible for Initiation of database operations, from the service the respective command and queries are get called to perform operations.
    - WebAPI : The WebAPI project is the entrypoint for the APIs, it contains t he controllers, Validators and AutoMapper. WebAPI project use all the other projects as an dependency references.
    - WebClient: The WebClient project is the entry point for the UI interface of the application. In contains the required Razor pages and other UI supporting elements.
# Build configuration
    1. Import the project
    2. Make WebClient as a start up project and run.
    3. In case you just want to run APIs, make WebAPI as a start up project and run.
# Framework details
    1. Application build with .Net core framework with CQRS and MVC
     
