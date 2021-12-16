pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy UI Server .122') {
            steps {
               sh 'ssh -o StrictHostkeyChecking=no deploy@172.16.18.122 "cd /var/www/html/planrep/frontend/planrep-ui; \
                  git pull origin master; \
                  npm install; \
                  ng build "'
            }
        }
        stage('Deploy UI Server .132') {
            steps {
               sh 'ssh -o StrictHostkeyChecking=no deploy@172.16.18.132 "cd /home/deploy/planrep-ui; \
                  git pull origin master; \
                  npm install; \
                  ng build; \
                  cp -r dist/planrep-frontend/* /var/www/html/planrep/planrep-frontend/ "'
            }
        }
    }
}
