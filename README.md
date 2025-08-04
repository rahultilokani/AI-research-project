AI Research Project: Serverless Chatbot Framework
This project demonstrates a scalable, serverless architecture designed to replicate AI chatbot behavior using AWS services. It simulates dynamic question-and-response interactions through surveys, enabling researchers to deploy intelligent, data-driven experiences without managing infrastructure.

🔍 Project Overview
The system mimics AI chatbot functionality through customizable survey flows driven by serverless components. It supports:

AI-like dynamic conversation logic

Role-based user access

Scalable storage and retrieval of survey data

Interactive visualization of response metrics

🧠 Use Case
Ideal for academic and research institutions aiming to collect, analyze, and visualize survey responses with AI-enhanced personalization and logic flow — all in a secure and scalable AWS cloud environment.

🛠️ Architecture Components
📱 Frontend & User Interaction
Component	Purpose
Amazon CloudFront	Delivers frontend content with low latency via edge caching
AWS Amplify Hosting	Hosts the React-based web application for researchers and participants
Amazon Cognito	Manages secure authentication and user role access
AWS WAF	Protects against web-based attacks and ensures institutional compliance

🔄 Survey Logic & Backend
Component	Purpose
AWS Step Functions	Orchestrates survey flows and branching logic
Amazon API Gateway	Interfaces between frontend and backend
AWS Lambda	- Executes survey logic
- Handles config
- Fetches results
Amazon DynamoDB	NoSQL database for storing metadata, responses, and user activity

📊 Data Storage & Analytics
Component	Purpose
Amazon S3	Stores raw data, insights, and downloadable archives
Amazon QuickSight	Visualizes results with dynamic dashboards and metrics
Amazon SQS	Manages asynchronous processing (used for decoupling components)
Amazon CloudWatch	Logs and monitors Lambda/API performance and errors

🚀 Features
Role-based survey configuration and access

Serverless chatbot-like interactions

Branching logic for dynamic user flow

Real-time analytics dashboards

Scalable, fault-tolerant, and secure architecture

📂 Project Roles
Team Member	Key Contributions
Varun	CloudFront and Amplify Hosting
Connor	VPC setup and Cognito configuration
Priya	WAF, API Gateway, and DynamoDB integration
Rahul	Amazon SQS and CloudWatch monitoring
Sai	Lambda functions and API integration
Medhansh	S3 storage and QuickSight dashboarding

📦 Setup & Deployment
⚠️ Note: This project uses AWS services. Ensure you have AWS CLI configured and appropriate IAM roles set up.

Clone the Repo

bash
Copy
Edit
git clone https://github.com/rahultilokani/AI-research-project.git
cd AI-research-project
Frontend Deployment

Deploy React app via AWS Amplify or S3 + CloudFront.

Connect it to Cognito for authentication.

Backend Infrastructure

Use AWS CDK / Terraform / CloudFormation to provision:

Lambda functions

API Gateway endpoints

Step Functions workflows

DynamoDB tables

Analytics Setup

Store raw data in S3

Connect QuickSight to S3/DynamoDB for dashboards

📈 Example Use Flow
Researcher logs in and creates a survey (via UI)

User responds to AI-like questions (driven by Lambda + Step Functions)

Responses are saved in DynamoDB and S3

Researchers view real-time insights on QuickSight dashboards

📄 License
This project is for academic and educational use. Licensing details to be defined.
