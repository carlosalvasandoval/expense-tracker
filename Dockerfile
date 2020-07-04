FROM php:7.3-apache

# Install PHP extension dependencies
RUN apt-get update && apt-get install -y --no-install-recommends zlib1g-dev libicu-dev\
  openssh-client ca-certificates tar gzip unzip zip libzip-dev gnupg \
  && a2enmod rewrite

# Install PHP extensions
RUN pecl install -o -f xdebug \
  && rm -rf /tmp/pear \
  && docker-php-ext-install mbstring mysqli pdo pdo_mysql zip intl \
  && docker-php-ext-enable xdebug

# PHP configuration
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

COPY ["custom.ini","/usr/local/etc/php/conf.d/"]

RUN chmod -R 777 /var/www/html
RUN chown -R www-data:www-data /var/www/html