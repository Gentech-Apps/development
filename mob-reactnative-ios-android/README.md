# Demo Project for React Native implementation 

Project to demonstrate the React Native implementation for Native mobile applications.

# Project Description
1. The application is developed with React version 18 
2. The purpose of the application was to make the canteen process paperless. It gives users the flexibility to order food and manage their wallets. Vendors can request and manage inventory, menus, price lists, and accept orders from customers.
3. The source contains two React Native applications: one for the client and another for the vendor. The vendor application was developed with a focus on vendor operations. The application is multilingual and supports English and Hindi languages simultaneously. Both applications support Android as well as iOS platforms.
4. Both applications contains the well maintained integration layer for API calling and request & response processing.
5.  The application contains the notification feature which is managed using Google Firebase.
6. The application is planed as a SaaS so flexible in multiple tenant infrastructure.
7. Applications are available in App Store for specific geo location and specific account domains.

# Project Structure
1. The application is divided in to three major parts
	- The Presentation layer
	- The Model layer where we managed the response object models and API callings
	- The utility layer which help in managing the client side operations.
2. We used Firebase for notification management.
3. The application contains folders named android and iOS which  are managing the wrapper code which share the centralised source code of application to launch application on android/iOS platform.
4. The src folder contains the overall application, which mainly contains containers, components redux and store which are for UI management and data sharing between the components respectively.

# Application build process Refer the Readme of project.

