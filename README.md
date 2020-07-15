# Expense tracker
This project has the intention of creating a simple expenses tracker.

## Project requirements
- [docker](https://www.docker.com/get-started) 
- docker compose

## Instalation instructions
- copy .env.example to .env
- run `docker-compose up -d` for downloading all images and create all containers
- make sure all container are alive `docker ps`
- run this command to config the project `docker-compose exec web sh /var/www/html/scripts/init.sh`
- In file `.env` you can see ADMIN_EMAIL=`admin@admin.com`  and ADMIN_PASSWORD=`123456` use these credential for login.

[DEMO](http://172.105.150.187)
user: `admin@admin.com` password: `123456`

## License
 [MIT license](https://opensource.org/licenses/MIT).
