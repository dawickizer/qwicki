# Summary

This repository contains the starter code for a Dockerized MEAN (MongoDB, Express, Angular, Node) App which has Phaser.io, BabylonJS, and ThreeJS integrated.

# Run Locally

- Make sure Docker is installed on your system (https://docs.docker.com/get-docker/)
- Make sure docker-compose is installed on your system (https://docs.docker.com/compose/install/)
- Make sure npm is installed on your system (https://www.npmjs.com/get-npm)
- Open your terminal/cmd prompt and `cd wherever/you/downloaded/qwicki/angular-client`
- Run `npm install`
- Open your terminal/cmd prompt and `cd wherever/you/downloaded/qwicki/express-server`
- Run `npm install`
- Navigate back to the root directory of this project (`cd ..`)
- Run `docker-compose up --build`
- Navigate to `localhost:4200` in your browser and login or signup. 
- You can navigate through the tabs and see the Phaser.io, BabylonJS, and ThreeJSs
- Run `docker-compose down` to stop the app from being served

# Endpoints

- Angular Client: `localhost:4200`
- Express Server: `localhost:3000`
- MongoDB: `localhost:27017`
- Mongo Express: `localhost:8081`
- Colyseus Social `localhost:2567`
- Colyseus Social Metrics Dashboard `localhost:2567/colyseus`
- Colyseus Game `localhost:2568`
- Colyseus Game Metrics Dashboard `localhost:2568/colyseus`


# Formatter

- All of the microservices have formatters/linters that can be run locally and are required for passing the cicd pipelines
- Run `npm run format` in any of the microservice directories to run the formatter followed by the linter. **Note:** Its best to do this before pushing code to pass the CICD pipelines. Its not mandatory as formatting on every push/commit can be annoying lol
- Take a look at any of the `package.json` files in the microservice directories to see more `npm run` commands.
# Note

- If you are using Docker Desktop for Windows you might have to set a file sharing path to work with one of the bind mounts in the `docker-compose.yml` file.
- Go to Docker Desktop (from toolbar) > Settings > Resources > File Sharing
- Add the path `wherever/you/downloaded/qwicki/angular-client`
- Add the path `wherever/you/downloaded/qwicki/express-server`
- Restart Docker Desktop

-------------------

- You might have to increase the memory allocation that your local machine allows Docker to use. The default allocated memory is 2GB. Increasing to 4GB seems to prevent memory allocation bugs when building Docker images.
- If you are on Docker Desktop for Windows go to Docker Desktop (from toolbar) > Settings > Resources > Advanced
- Increase Memory

# Deploy to Amazon EKS

## AWS Console Setup

- Create `Amazon AWS Account`. Note: You will be logged in as `Root User` (https://aws.amazon.com/)
- Setup an `Admin` account through `IAM` so that you can perform your operations as `Admin` and NOT `Root`. Note: This is AWS Best Practice (https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html)
- Log in with your newly created `Admin` account
- In the AWS Console click on your user profile and select `My Security Credentials`
- Click on the `Create access key` button
- Click on the `Download .csv file` button to save on your local machine (Keep safe and remember where you store this)

## AWS CLI Setup

- Install `AWS CLI` to interact with your AWS account via the command line (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- Open a Terminal/Command Prompt and type `aws configure` and follow the prompts entering your `Access Key/Secret Access Key` (generated from step 5 and 6 above):
- `AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE`
- `AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- `Default region name [None]: us-east-2`
- `Default output format [None]: json`
- This will save/modify a `config` file and a `credentials` file in your `~/.aws` directory so that the `AWS CLI` can now interact with your `Admin` AWS Account

## Kubernetes Setup

- Install `kubectl` to interact with `Kubernetes Clusters` via the command line (https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- Install `eksctl` to provision/deprovision a `Kubernetes Cluster` via `AWS EKS` service. `eksctl` uses the `AWS CLI` to provision a `Kubernetes Cluster` via the command line (https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)

## Provision AWS Resources

- Provision a `Kubernetes Cluster` by running `eksctl create cluster --name qwicki --region us-east-1 --node-type t2.micro --nodes 2 --managed` (you can tweak these settings to your liking). This will take about 10-15 minutes to provision the AWS Resources
- While the resources are provisioning log in to `AWS Console` and check `CloudFormation` to verify a stack is being provisioned. You should see a `eksctl-qwicki-cluster` stack with a status of `CREATE_IN_PROGRESS` (https://console.aws.amazon.com/cloudformation)
- Sometimes when you run the `eksctl create cluster...` command you will get an error message in the terminal like: `Cannot create cluster 'qwicki' because us-east-1e, the targeted availability zone, does not currently have sufficient capacity to support the cluster. Retry and choose from these availability zones: us-east-1a, us-east-1b, us-east-1c, us-east-1d, us-east-1f` and you will notice your `CloudFormation` stack has a status of `ROLLBACK_IN_PROGRESS`. If this happens then DELETE the `CloudFormation` stack via the `AWS Console` and rerun the `eksctl create cluster --name qwicki --region us-east-1 --zones us-east-1a,us-east-1b --node-type t2.micro --nodes 2 --managed` command with the `--zones` flag specified with two of the recommended availability zones from the error message.
- Upon successful launch of a `Kubernetes Cluster` you can look over your provioned resources in the `AWS Console` by navigating to `Elastic Kubernetes Service` (https://console.aws.amazon.com/eks) which will display your cluster info. You can also check the `EC2` instances that are being used for your `Kubernetes Cluster` by navigating to `EC2` (https://console.aws.amazon.com/ec2)
- Now that the `Kubernetes Cluster` is provioned on `AWS EKS` you can iteract with it via `kubectl` on the command line. `eksctl` automatically makes updates to your `~/.kube` directory upon successsful provioning of `AWS` resources for the `Kubernetes Cluster` on your local machine so that you dont have to worry about configuration 
- Some key commands to run to interact with your `Kubernetes Cluster` after you follow the deployment steps below:
- `kubectl get all` to display all of the resources you will (as well as some default resources)
- `kubectl get deployments` to see your `deployment`
- `kubectl get pods` to see your pods (which runs the `Docker` `containers` the apps are in)
- `kubectl logs {your pod name}` to display the output of the `Docker` `container` running in the `pod`
- `kubectl exec -it {your pod name} bash` to jump inside the `Docker` `container` running in the `pod` (type `exit` when done)
- `kubectl get services/{app name}-service` to see your `service` (which exposes your `deployment` to the web)


## PROVISION KLUSTER

`cd /qwicki`\
`eksctl create cluster --name qwicki --region us-east-1 --zones us-east-1a,us-east-1b --node-type t2.medium --nodes 2 --managed`

## MONGO DB 

`kubectl apply -f ./mongo-db/mongo-secret.yml (HOLD OFF)`\
`kubectl apply -f ./mongo-db/mongo.yml`\
`kubectl apply -f ./mongo-db/mongo-configmap.yml`

## MONGO EXPRESS

`kubectl apply -f ./mongo-express/mongo-express-secret.yml`\
`kubectl apply -f ./mongo-express/mongo-express.yml`\
`kubectl get services/mongo-express-service`

copy EXTERNAL_IP\
Optional:  Past EXTERNAL_IP in browser to verify successful deployment of Mongo Express Admin UI

## EXPRESS 

`docker build -t dwickizer1/qwicki:express_prod -f ./express-server/Dockerfile.prod --build-arg MONGO_DB_ENDPOINT=mongodb://mongodb-service/qwicki ./express-server`
`docker push dwickizer1/qwicki:express_prod`

`kubectl apply -f ./express-server/express.yml`\
`kubectl get services/express-service`

copy EXTERNAL_IP\
Optional:  Past EXTERNAL_IP in browser to verify successful deployment of Express API

## ANGULAR

update EXPRESS_SERVER with copied EXTERNAL_IP in ./angular-client/src/environments/environment.prod.ts (make sure to have http:// and remove end slash)

`docker build -t dwickizer1/qwicki:angular_prod -f ./angular-client/Dockerfile.prod ./angular-client`\
`docker push dwickizer1/qwicki:angular_prod`

`kubectl apply -f ./angular-client/angular.yml`\
`kubectl get services/angular-service`

copy EXTERNAL_IP\
Optional:  Past EXTERNAL_IP in browser to verify successful deployment of Angular App

## DELETE RESOURCES 

`eksctl delete cluster --name qwicki`

## Update Docker Images To Be Deployed

`docker build -t dwickizer1/qwicki:express_prod -f ./express-server/Dockerfile.prod --build-arg MONGO_DB_ENDPOINT=mongodb://mongodb-service/qwicki ./express-server`\
`docker push dwickizer1/qwicki:express_prod`

`docker build -t dwickizer1/qwicki:angular_prod -f ./angular-client/Dockerfile.prod ./angular-client`\
`docker push dwickizer1/qwicki:angular_prod`

