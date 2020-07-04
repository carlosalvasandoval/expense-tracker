#!/bin/bash
cd /var/www/html
npm install
echo 'composer install'
composer install
php artisan ui vue
php artisan ui vue --auth
echo 'running database migrations and seeding DB' 
php artisan migrate --seed
