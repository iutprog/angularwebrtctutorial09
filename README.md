## URL mkcert:
 https://himynameistim.com/blog/mkcert

## Open cmd with elevated permission

## Install mkcert, to do this from a admin command window run
choco install mkcert

## Verifiy the installation and approve:
mkcert -install

## check the version
mkcert -version

## Get your local IP in Windows CMD
 ipconfig

## Generate certificates for localhost
mkcert localhost 127.0.0.1 ::1

## Create certificates for local network !
mkcert "localhost" "192.168.1.113"

## Configure Angular to Use HTTPS

- Open the angular.json file in your project.
- Find the architect section under your project and the serve target.
- Add HTTPS configuration under options:
"projects": {
  "your-project-name": {
    "architect": {
      "serve": {
        "options": {
          "ssl": true,
          "sslCert": "path/to/localhost.pem",
          "sslKey": "path/to/localhost-key.pem"
        }
      }
    }
  }
}

## Run the Angular Application with HTTPS
ng serve

## If you want to run the app on a specific port, use:
ng serve --ssl --ssl-cert "path/to/localhost.pem" --ssl-key "path/to/localhost-key.pem" --port 443


 ## run angular
 ng serve --ssl --ssl-cert ./server/localhost+1.pem --ssl-key ./server/localhost+1-key.pem --host 0.0.0.0 --port 4200

## Find process id
netstat -ano | findstr :4200

## Kill a process by id
taskkill /PID <PID> /F
taskkill /PID 26352 /F

## Clear the cache
ng cache clean
