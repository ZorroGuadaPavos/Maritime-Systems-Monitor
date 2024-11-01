# Purpose 

Aim of this challenge is threefold:

1. Evaluate your coding abilities
2. Test you analytical skills (understanding the problem and solving it accordingly)
3. Judge your technical experience and/or learning curve

## How you will be judged 

1. Code design and style (functionality, flexibility, readability)
2. Analytical understanding of the problem
3. Presentation and visualisation of your findings 


# Instructions 

This coding exercise should be performed in python and react. 
You are free to use the internet and any other libraries. 
Please save your work in a zip file and email it to us for review. Do not push your work to a public repository! 
On top of that, you should prepare a presentation of your work and findings that you will present 
in 10 minutes to non-coding experts at the next interview. 

# Objective

Develop a monitoring software for a vessel's ballasting system.

## The situation

The ballasting system on Marine vessels consist of tanks, pumps, valves, pipes and sea inlets (seachest) and sea outlets (overboard). 
Water is pumped from the sea to the tanks to control the vessel's heel, trim and draught and to account for tidal changes. 
A marine engineer created a settings file (*vessel.yml*) that contains all the tanks, pumps, pipes and seas together 
with a list of the valves each piece of equipment is connected to.

Your task is to build the vessel model from the settings file and write a module to identify which equipment is connected 
to which equipment when certain valves are open and other valves are closed. 
Furthermore, create a UI where the user can change the valve status to open and closed, 
together with a menu where the user can request to what equipment a specific piece of equipment is connected to.
No need to make the UI to fancy, functionality and modularity are more important.

## Take the following things into account:
* Use poetry as package manager for the server
* Use npm as package manager for the client
* Follow the PEP8 coding guidelines
* Follow the Airbnb JavaScript Style Guide
* Enhance readability by exploiting type hinting
* Write useful and clear comments
* Use clear function and variable names
* Design your solution for modularity
* Write unit tests for all functions

# Getting started
## Server side
* Install latest python version (3.11)
* Install Poetry: `pip3.11 install poetry` or `python3.11 -m pip install poetry`
* Run: `poetry install` inside the server folder to install all dependencies
* You can add new packages to the project via: `poetry add [PACKAGE_NAME]`
* Execute the program using `poetry run ...`
  * For example: 
    * `poetry run python main.py`
    * `poetry run invoke test`
* Testing and formatting scripts can be found in the **server/scripts** folder
## Client side
* Install nodejs: https://nodejs.org
* Run: `npm install` inside the server folder to install all dependencies
* You can add new packages to the project via: `npm install [PACKAGE_NAME]`
* Execute the client using `npm start`

# Bonus question
Extra points can be obtained if you implement multi users to be able to interact with the tool independently.

## Good luck!
