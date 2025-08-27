FROM mysql:8.0.34


ENV MYSQL_ROOT_PASSWORD=teste123

COPY migration* /docker-entrypoint-initdb.d

RUN ls /docker-entrypoint-initdb.d

EXPOSE 3306