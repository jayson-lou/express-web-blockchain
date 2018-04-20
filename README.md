

# Little blockchain demonstration

This is to demonstrate how the blockchain works with a web application. The following concepts are demonstrated:
 - Genesis block 
 - Hash calculation
 - Minging difficulty
 - Proof of Work consensus

## Quick Start

This project was implemented with **Node.js Express Framework** and **EJS Template Engine**. The data is stored in **MongoDB** (on mLab). In order to run it locally:

 - Download the project.
 - Run `npm install` to download dependencies
 - Run `npm start` (or `npm devstart` to start as deamon) to start the application
 - Visit http://localhost:3000/

Alternatively, you can use Docker to install the application on your machine. 

## Usage

From the main screen, you can see all the pending transactions in the DB, you can also create new transaction, mine the pending tranactions or to display the current chain:
    ![Alt text](/images/ss-1.png?raw=true "Main screen")

Here is an example of the chain:
    ![Alt text](/images/ss-2.png?raw=true "Blockchain Display")
 <!--
 - To play around with the demo, go to: http://ec2-34-217-113-112.us-west-2.compute.amazonaws.com:3000/ - my DEV environment on AWS. 
-->
## Developing  
  - Express Framework
  - EJS Template Engine
  - MongoDB (hosted on mLab)
  - Crypto-js

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.

