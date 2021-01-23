Summary
===============

This code base contains the starter code for a Phaser and BabylonJS game. It is integrated with a MEAN stack and it is Dockerized. The Phaser game and BabylonJS game is running client side with Angular and being served up on localhost:4200. Socket.io is also integrated at a base level as well as some starter code for builing a service that interacts with Express API (localhost:3000). This is a good starting point for anyone who wants to create client side Phaser game or BabylonJS game while also being able to build a website around the game using the MEAN stack.

Run Locally
===============

1. Make sure Docker is installed on your system (https://docs.docker.com/get-docker/)
2. Make sure docker-compose is installed on your system (https://docs.docker.com/compose/install/)
3. Make sure npm is installed on your system (https://www.npmjs.com/get-npm)
4. Open your terminal/cmd prompt and `cd wherever/you/downloaded/mean/angular-client`
5. Run `npm install`
6. Open your terminal/cmd prompt and `cd wherever/you/downloaded/mean/express-server`
7. Run `npm install`
8. Navigate back to the root directory of this project (`cd ..`)
9. Run `docker-compose up --build`
10. Navigate to `localhost:4200` in your browser (Chrome for example). Navigate through the tabs and see the Phaser, Babylon, Express API, and Socket.io integrations
11. Run `docker-compose down` to stop the app from being served

Endpoints
===============

1. Angular Endpoint: `localhost:4200`
2. Express API endpoint: `localhost:3000`
3. MongoDB endpoint: `localhost:27017`

Note
===============

1. If you are using Docker Desktop for Windows you might have to set a file sharing path to work with one of the bind mounts in the `docker-compose.yml` file.
2. Go to Docker Desktop (from toolbar) > Settings > Resources > File Sharing
3. Add the path `wherever/you/downloaded/mean/angular-client`
4. Add the path `wherever/you/downloaded/mean/express-server`
5. Restart Docker Desktop

-------------

fdsafd

Deploy to Amazon EKS
=====================

AWS Console Setup
-----------------
1. Create `Amazon AWS Account`. Note: You will be logged in as `Root User` (https://aws.amazon.com/)
2. Setup an `Admin` account through `IAM` so that you can perform your operations as `Admin` and NOT `Root`. Note: This is AWS Best Practice (https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html)
3. Log in with your newly created `Admin` account
4. In the AWS Console click on your user profile and select `My Security Credentials`
5. Click on the `Create access key` button
6. Click on the `Download .csv file` button to save on your local machine (Keep safe and remember where you store this)

AWS CLI Setup
-----------------
1. Install `AWS CLI` to interact with your AWS account via the command line (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
2. Open a Terminal/Command Prompt and type `aws configure` and follow the prompts entering your `Access Key/Secret Access Key` (generated from step 5 and 6 above):
3. `AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE`
4. `AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
5. `Default region name [None]: us-east-2`
6. `Default output format [None]: json`
7. This will save/modify a `config` file and a `credentials` file in your `~/.aws` directory so that the `AWS CLI` can now interact with your `Admin` AWS Account

Kubernetes Setup
-----------------
1. Install `kubectl` to interact with `Kubernetes Clusters` via the command line (https://kubernetes.io/docs/tasks/tools/install-kubectl/)
2. Install `eksctl` to provision/deprovision a `Kubernetes Cluster` via `AWS EKS` service. `eksctl` uses the `AWS CLI` to provision a `Kubernetes Cluster` via the command line (https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)

Provision AWS Resources
-----------------
1. Provision a `Kubernetes Cluster` by running `eksctl create cluster --name mean --region us-east-1 --node-type t2.micro --nodes 2 --managed` (you can tweak these settings to your liking). This will take about 10-15 minutes to provision the AWS Resources
2. While the resources are provisioning log in to `AWS Console` and check `CloudFormation` to verify a stack is being provisioned. You should see a `eksctl-mean-cluster` stack with a status of `CREATE_IN_PROGRESS` (https://console.aws.amazon.com/cloudformation)
3. Sometimes when you run the `eksctl create cluster...` command you will get an error message in the terminal like: `Cannot create cluster 'mean' because us-east-1e, the targeted availability zone, does not currently have sufficient capacity to support the cluster. Retry and choose from these availability zones: us-east-1a, us-east-1b, us-east-1c, us-east-1d, us-east-1f` and you will notice your `CloudFormation` stack has a status of `ROLLBACK_IN_PROGRESS`. If this happens then DELETE the `CloudFormation` stack via the `AWS Console` and rerun the `eksctl create cluster --name mean --region us-east-1 --zones us-east-1a,us-east-1b --node-type t2.micro --nodes 2 --managed` command with the `--zones` flag specified with two of the recommended availability zones from the error message.
4. Upon successful launch of a `Kubernetes Cluster` you can look over your provioned resources in the `AWS Console` by navigating to `Elastic Kubernetes Service` (https://console.aws.amazon.com/eks) which will display your cluster info. You can also check the `EC2` instances that are being used for your `Kubernetes Cluster` by navigating to `EC2` (https://console.aws.amazon.com/ec2)
5. Now that the `Kubernetes Cluster` is provioned on `AWS EKS` you can iteract with it via `kubectl` on the command line. `eksctl` automatically makes updates to your `~/.kube` directory upon successsful provioning of `AWS` resources for the `Kubernetes Cluster` on your local machine so that you dont have to worry about configuration 
6. Some key commands to run to interact with your `Kubernetes Cluster` after you follow the deployment steps below:
7. `kubectl get all` to display all of the resources you will (as well as some default resources)
8. `kubectl get deployments` to see your `deployment`
9. `kubectl get pods` to see your pods (which runs the `Docker` `containers` the apps are in)
10. `kubectl logs {your pod name}` to display the output of the `Docker` `container` running in the `pod`
11. `kubectl exec -it {your pod name} bash` to jump inside the `Docker` `container` running in the `pod` (type `exit` when done)
12. `kubectl get services/{app name}-service` to see your `service` (which exposes your `deployment` to the web)

Deploy Angular App
------------------
1. In your terminal navigate to `/angular-client` of the project. This directory contains `angular.yml` which is a config file for `kubectl` that you will use to create `Kubernetes` resources (specifically a `deployment` and `service` to expose the `deployment`)
2. Run `kubectl apply -f angular.yml` to create the resources. Note: This will provision a `Load Balancer` on `AWS` which you can observe via the `AWS Console`
3. Run `kubectl get services/angular-service` and copy the `EXTERNAL-IP`
4. Paste it a browser to see the webapp

Deploy Express App
-----------------
1. In your terminal navigate to `/express-server` of the project. This directory contains `express.yml` which is a config file for `kubectl` that you will use to create `Kubernetes` resources (specifically a `deployment` and `service` to expose the `deployment`)
2. Run `kubectl apply -f express.yml` to create the resources. Note: This will provision a `Load Balancer` on `AWS` which you can observe via the `AWS Console`
3. Run `kubectl get services/express-service` and copy the `EXTERNAL-IP`
4. Paste it a browser to see the webapp

Tear Down Resources
--------------------
1. Make sure you are in the `/angular-client` directory of the project
2. Run `kubectl delete -f angular.yml` to delete your `Kubernetes` resources
3. Make sure you are in the `/express-server` directory of the project
4. Run `kubectl delete -f express.yml` to delete your `Kubernetes` resources
5. Run `eksctl delete cluster --name mean` to delete the `AWS` provisioned resources

Update Docker Images To Be Deployed
-----------------------------------
1. Make sure you are in the `/angular-client` directory of the project
2. Run `docker build . -t dwickizer1/mean:angular_prod -f Dockerfile.prod`
3. This will build and tag a new version of the angular image to `DockerHub` which can then be deployed to `AWS EKS`
4. Run `kubectl apply -f angular.yml` to update the image deployed on `AWS EKS`
5. Make sure you are in the `/express-server` directory of the project
6. Run `docker build . -t dwickizer1/mean:express_prod -f Dockerfile.prod`
7. This will build and tag a new version of the express image to `DockerHub` which can then be deployed to `AWS EKS`
8. Run `kubectl apply -f express.yml` to update the image deployed on `AWS EKS`
