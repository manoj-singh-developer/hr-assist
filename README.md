# HR-ASSIST

##### On Ubuntu

In order to install the application on a clean ubuntu environment please follow the steps:

1. Install requirements

    ```
    sudo apt-get install ruby-full
    sudo apt-get install git
    sudo apt-get install nodejs
    sudo apt-get install build-essential
    sudo apt-get install mysql-server mysql-client libmysqlclient-dev libsqlite3-dev
    cd YOUR_DESIRED_APP_FOLDER
    git clone https://github.com/assist-software/hr-assist.git .
    gem install bundler
    bundle
    ```


2. Copy all files from `config/examples` into `config/` and remove `.example` from the file name.

```
cp -R config/examples/* config/
cd config
mv database.yml.example database.yml
mv ldap.yml.example ldap.yml
mv secrets.yml.example secrets.yml

```

3. Set the MySql credentials for the `database.yml`.

    - Run `rake secret` on the project root and fill the `secrets.yml` file on development and test keys with secret keys.

4. Run `rails db:migrate` to generate the database tables.
5. Run `rails db:seed:requirements` to populate the database with required data and `rails db:seed:
5. Start the server:
    ```
    rails s
    ```
5. Access the API at http://localhost:3000/api/v1/endpoint
6. Access the Admin Dashboard at http://localhost:3000/admin

##### Via Docker

In order to install the application via docker please follow the steps:

1. Run the following commands:
    ```
    cd YOUR_DESIRED_APP_FOLDER
    git clone https://github.com/assist-software/hr-assist.git .
    cd Docker
    #edit docker-compose.yml and set your path to your project on volume key
    ```
2. Copy all files from `config/examples` into `config/` and remove `.example` from the file name.
3. Set the MySql credentials for the `database.yml` as they are in `Docker/env/mysql.env`
4. Run `docker-compose up --build --force-recreate -d`
5. Exec an instance of app container and run:
    ```
    rails db:migrate
    ```
