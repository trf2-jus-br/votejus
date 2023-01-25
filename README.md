# Votejus

Votejus é um sistema desenvolvido para conduzir votações secretas no âmbito do Tribunal Regional Federal da 2&ordf; Região.

Não serão armazenados dados que possam correlacionar o eleitor ao candidato. Para cada eleitor é armazenada apenas a data e hora do voto e, para cada candidato, apenas a quantidade total de votos.

Procedimento para implantação:

- Disponibilizar um banco de dados MySQL e executar o script migration.sql

- Configurar as propriedades de ambiente:
  - Para controle de acesso:
    - JWT_SECRET=***SUBSTITUIA_POR_UM_UUID_ALEATÓRIO***
    - JWT_EXPIRATION_TIME=24h
  
  - Para acesso ao servidor de email:
    - SMTP_FROM=votejus@empresa.com.br
    - SMTP_HOST=smtp.empresa.com.br
    - SMTP_PORT=25
    - SMTP_USER=
    - SMTP_PASSWORD=

  - Para acesso ao servidor de banco de dados:
    - MYSQL_HOST=localhost
    - MYSQL_PORT=3306
    - MYSQL_USER=root
    - MYSQL_PASSWORD=
    - MYSQL_DATABASE=votejus

  - Para informar a URL onde estará instalado o Votejus:
    - API_URL_BROWSER=http://localhost:3000/

  - Opcionalmente, para restringir os emails que não aceitos como administrador:
    - ADMIN_EMAIL_REGEX=@empresa.com.br$
