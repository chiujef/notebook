# Notebook

This project was created to learn more about Angular 4. This is a simple OneNote-like web implementation.
User can create a _**note**_ and add any text in it. The user can then compile these _**notes**_ into a _**notebook**_.

The codes were created with an Observable Data Service pattern as described at 
[Angular University](http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/).

To test the site locally, _mock_ services were made instead of communicating with a web api.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.2. Kindly see 
[Default Configuration](#default-configuration) for more details.
This project also uses **bootstrap** to quickly design the layout. Please note that this project was created for learning purposes 
therefore design is not a priority.

## Table of Contents

* [Getting Started](#getting-started)
* [Installation](#installation)
* [Running](#running)
* [Default Configuration](#default-configuration)

## Getting Started

Default settings from the [Angular CLI](https://github.com/angular/angular-cli) was retained therefore all 
[Default Configuration](#default-configuration) should work as expected.

## Installation

As the *node_modules* folder was not included, kindly run first:

```bash
npm install
```

## Running

To run the dev server and open the browser automatically:

```bash
ng serve --open
```

If there are any issues encountered, kindly see [Further Help](further-help) section.

## Default Configuration

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
