# How to install HCW@Home with Docker

## Deploy Docker Compose

The following sample give you example of how deploying a coturn server with Docker Compose. Don't forget to adjust the following settings:

- myuser which is the login account to use turn feature
- mypass which is the password account to use turn feature
- realm which can be any name of fictive domain you choose

```
services:
  coturn:
    image: docker.io/coturn/coturn
    environment:
      - DETECT_EXTERNAL_IP=yes
      - DETECT_RELAY_IP=yes
    ports:
      - "3478:3478"
      - "3478:3478/udp"
      - "5349:5349"
      - "5349:5349/udp"
      - "49152-65535:49152-65535/udp"
    command: "--fingerprint --lt-cred-mech --user myuser:mypass --realm yourdomain.com
    network_mode: "host"
```

Put the content bellow in docker-compose.yml file and run the following command

docker compose up -d

Check the service is correctly started with the following command

docker compose logs -f

## Deploying mediaserver with Docker Compose

The following sample give you example of how deploying a mediasoup server with Docker Compose. Don't forget to adjust the following settings:

    replace mydomain.com by you domain.
    replace PUBLIC_IP value by you real server IP
    replace ANNOUNCED_IP value by you internet public IP
    replace API_USER and API_SERVER values by user you choose.
    replace JWT_SECRET value by random secret.

```
services:
  backend:
    image: docker.io/iabsis/mediasoup-api
    ports:
      - "3443:3443"
    environment:
      ## Define random key here
      - JWT_SECRET=aadsrwerrf

      ## Configure credentials used to consume mediasoup API
      - API_USER=abcd
      - API_SECRET=1234

      ## Define here the public IP server
      - PUBLIC_IP=1.2.3.4

      ## If server is behind nat, you might need to advertise
      # the real public IP by commenting out this line.
      - ANNOUNCED_IP=1.2.3.4

      ## You will need to open UDP port in the follow range, you
      # can adjust the range if required.
      # - RTC_MIN_PORT=40000
      # - RTC_MAX_PORT=49000

      ## The best practice is to use reverse proxy, but if you want
      # this API to serve directly HTTPS, you might need to configure the
      # following lines
      # - HTTP_ONLY=true
      - LISTEN=3443
      - CERT=/etc/mediasoup-api/certs/example.com/fullchain.pem
      - KEY=/etc/mediasoup-api/certs/example.com/privkey.pem

      ## Redis server
      - REDIS_HOST=redis

    depends_on:
      - redis
    volumes:
      - ./data/certbot/:/etc/mediasoup-api/certs

  redis:
    image: redis

  certbot:
    image: certbot/certbot:latest
    volumes:
      - ./data/certbot/:/etc/letsencrypt/live
    command: certonly --standalone -d turn.mydomain.com --non-interactive --agree-tos --email info@mydomain.com

  certbot-renew:
    image: certbot/certbot:latest
    volumes:
      - ./data/certbot/:/etc/letsencrypt/live
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

Put the content bellow in docker-compose.yml file and run the following command

```
docker compose up -d
```

Check the service is correctly started with the following command

```
docker compose logs -f
```

## Deploying HCW@Home with Docker Compose

The following sample give you example of how deploying HCW@Home stack with Docker Compose. Double check the differents values you need to define.

```
services:
  mongo:
    image: mongo:6
    volumes:
      - ./data/mongo:/data/mongo

  patient:
    image: docker.io/iabsis/hcw-patient
    ports:
      - "8000:80"
    environment:
      - BACKEND_URL=http://backend:1337
    depends_on:
      - mongo
      - backend

  doctor:
    image: docker.io/iabsis/hcw-doctor
    ports:
      - "8001:80"
    environment:
      - BACKEND_URL=http://backend:1337
    depends_on:
      - mongo
      - backend

  backend:
    image: docker.io/iabsis/hcw-backend
    ports:
      - "1337:1337"
    environment:
      # Configure here database, by default
      # a local mongo is used.
      - DB_URI=mongodb://mongo:27017/hcw-athome

      # Configure Redis URL
      - REDIS_HOST=redis
      #- REDIS_PORT=6379
      #- REDIS_PASSWORD=

      # Generate random key used by JWT encoding.
      - APP_SECRET=''

      # If used, it's possible to create JWT token
      # externally with the following key.
      #SHARED_EXTERNAL_AUTH_SECRET=12345678

      # Wich environement file to use.
      - NODE_ENV=production

      # Public url to be accessed by the patient
      - PUBLIC_URL=https://<replace-by-my-domain>

      # Mail configuration.
      - MAIL_SMTP_HOST=<https://my-smtp-server.ch%3E/
      - MAIL_SMTP_PORT=465
      - MAIL_SMTP_SECURE=true
      - https://MAIL_SMTP_SENDER%3Dnoreply@hcw-athome.ch/
      - MAIL_SMTP_USER=
      - MAIL_SMTP_PASSWORD=

      ## Choose to use either OVH or Swisscom
      # Comment/comment out line according to
      # your environment

      # SMS OVH Gateway credentials
      # - SMS_OVH_SENDER=
      # - SMS_OVH_ENDPOINT=
      # - SMS_OVH_APP_KEY=
      # - SMS_OVH_APP_SECRET=
      # - SMS_OVH_APP_CONSUMER_KEY=

      # SMS Swisscom Gateway credentials
      # - SMS_SWISSCOM_ACCOUNT=
      # - SMS_SWISSCOM_PASSWORD=
      # - SMS_SWISSCOM_SENDER=

      # ClickATell SMS Gateway credentials
      - SMS_CLICKATEL=

      # Define enabled authentication methods
      # Can be one of the following choice
      # password : user will be inside Mongo only. (default)
      # saml : configure SAML entries, compatible with Azure.
      # both : user can login with both methods (saml and password).
      # openid : user will login with openid only.
      - LOGIN_METHOD=password

      # SAML environement
      # - SAML_CALLBACK=''
      # - SAML_ENTRY_POINT=''
      # - SAML_ISSUER=''
      # - EMAIL_FIELD='email'
      # - FIRSTNAME_FIELD='firstname'
      # - LASTNAME_FIELD='lastname'
      # - LOGOUT_URL=''
      # - SAML_PATH_KEY='/etc/hcw-athome/saml.key'
      # - SAML_CERT=''
      # - SAML_FIRSTNAME_FIELD='givenName'
      # - SAML_LASTNAME_FIELD='lastName'
      # - SAML_AUTOCREATE_USER=true

      # If you use Redmine, you can configure here
      # Access key to the project.
      # - REDMINE_DOMAIN=
      # - REDMINE_API_KEY=

      # If external API is used, define here
      # the mongo ID of the queue where default consultation
      # are dropping.
      # Default value is Default
      # - DEFAULT_QUEUE_ID=Default

      # Public url to be accessed by the doctor
      - DOCTOR_URL=https://<replace-by-my-domain>

      # ClamAv can be used to check sanity of transfered
      # files. Define there socket path for Antivirus Clamav
      - CLAM_HOST=clamav
      # - CLAM_PORT=3310

      # Enable AD if Active Directory or LDAP must be used
      # to get user information and groups.
      # Default value is false
      # - AD_ENABLE=false

      # Access to Active Directory server. Account service is
      # required here. Readonly is enough.
      # - AD_URIS=ldap://<ip or hostname of ad server>
      # - AD_BASE=dc=ad,dc=sample,dc=local
      # - AD_USER=-service-ad-readonly
      # - AD_PASSWORD=<replace-password>

      ## Allow user access if AD user in inside the following group.
      # - AD_DOCTOR_GROUP=HCWATHOME-DOCTOR

      # Auto Group to Queue mapping
      # Wildcard group is used to map AD group to internal Queue.
      # By example AD Group QUEUE-Psycho is mapped to Queue named Psycho.
      # - AD_QUEUE_MAP=^QUEUE-(.*)$

      # If AD is used, how to map user field to AD.
      # - AD_ATTR_FIRSTNAME=givenName
      # - AD_ATTR_FISTNAME=givenName
      # - AD_ATTR_LASTNAME=sn
      # - AD_ATTR_EMAIL=mail
      # - AD_ATTR_DEPARTMENT=department
      # - AD_ATTR_FUNCTION=company
      # - AD_ATTR_LOGIN=mail

      # If all Mediasoup servers fails, fallback
      # to the following server.
      - MEDIASOUP_URL=https://<replace-by-my-domain>
      - MEDIASOUP_USER=abcd
      - MEDIASOUP_SECRET=1234

      ## Branding used by HCW@Home
      - BRANDING=ICRC@Home

      ## Comment out if you want put a logo path.
      #LOGO=/etc/hcw-athome/logo.png

      ## Enable accessibility
      - ACCESSIBILITY_MODE=false

      # OpenID configuration.
      - OPENID_ISSUER_BASE_URL=''
      - OPENID_CLIENT_ID=''
      - OPENID_CLIENT_SECRET=''
      - OPENID_CALLBACK_URL=''
      - OPENID_AUTHORIZATION_URL==https://<replace-by-my-domain>
      - OPENID_TOKEN_URL=''
      - OPENID_USER_INFO_URL=''
      - OPENID_LOGOUT_URL=''
      - OPENID_AUTOCREATE_USER=true

      ## Path to store attachments
      - ATTACHMENTS_DIR=/data/attachments

    depends_on:
      - mongo
      - redis
      - clamav
    volumes:
      - ./data/attachments:/data/attachments
    restart: always

  redis:
    image: redis

  clamav:
    image: clamav/clamav
    ports:
      - "3310:3310"
```

