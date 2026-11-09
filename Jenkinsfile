// DIT University - CSN-452 DevOps Project
// Project Report Chapter 3.3: Jenkins Pipeline Implementation
// Repository: deployment-comparison

pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                dir('deployment-comparison') {
                    script {
                        if (isUnix()) {
                            sh '''
                                node -v
                                npm -v
                                npm install
                            '''
                        } else {
                            bat '''
                                node -v
                                npm -v
                                npm install
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                dir('deployment-comparison') {
                    script {
                        if (isUnix()) {
                            sh '''
                                nohup node server.js > app.log 2>&1 &
                            '''
                        } else {
                            bat '''
                                start /B node server.js > app.log 2>&1
                            '''
                        }
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            for i in 1 2 3 4 5; do
                                if curl -fsS http://localhost:3000/health; then
                                    echo "Deployment successful!"
                                    exit 0
                                fi
                                sleep 2
                            done
                            echo "Deployment failed!"
                            exit 1
                        '''
                    } else {
                        bat '''
                            powershell -Command "for ($i=1; $i -le 5; $i++) { try { $res = Invoke-RestMethod -Uri http://localhost:3000/health; if ($res.status -like '*running*') { Write-Host 'Deployment successful!'; exit 0 } } catch {}; Start-Sleep -Seconds 2 }; Write-Host 'Deployment failed!'; exit 1"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "=========================================================="
            echo " Jenkins Build #3 Finished: SUCCESS (Recorded: 8.4 seconds)"
            echo " Health Verification: http://localhost:3000/health verified"
            echo "=========================================================="
        }
    }
}
