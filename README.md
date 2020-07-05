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

## License
 [MIT license](https://opensource.org/licenses/MIT).
