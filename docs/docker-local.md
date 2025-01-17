# How to install HCW@Home with Docker for local testing purpose

We are offering a one docker-compose.yml ready file for local testing purpose. Just create the file with the following content, then use `docker compose up` to start the stack. This setup has been fully validated with Google Chrome.


```
services:

  coturn:
    image: docker.io/coturn/coturn
    ports:
      - "3478:3478"
      - "3478:3478/udp"
      - "49152-49162:49152-49162/udp"
    command: "--fingerprint --lt-cred-mech --user myuser:mypass --realm yourdomain.com"

  mediasoup:
    image: docker.io/iabsis/mediasoup-api
    environment:
      - JWT_SECRET=Super3trong4ey$
      - API_USER=abcd
      - API_SECRET=1234
      - ANNOUNCED_IP={{your_local_ip:192.168.1.10}}
      - RTC_MIN_PORT=40000
      - RTC_MAX_PORT=40010
      - LISTEN=3443
      - CERT=/usr/src/app/certs/sample.localhost.cert.pem
      - KEY=/usr/src/app/certs/sample.localhost.key.pem
      ## Redis server
      - REDIS_HOST=redis

      - TURN_SERVER1=turn:{{your_local_ip:192.168.1.10}}
      - TURN_USERNAME1=myuser
      - TURN_PASSWORD1=mypass

    ports:
      - "3443:3443"
      - "40000-40010:40000-40010/tcp"
      - "40000-40010:40000-40010/udp"

    depends_on:
      - redis

    volumes:
      - ./data/certbot/:/etc/mediasoup-api/certs

    entrypoint: ["/bin/bash", "-c", "PUBLIC_IP=$(hostname -i) node server.js"]

  mongo:
    image: mongo:6
    volumes:
      - ./data/mongo:/data/mongo

  patient:
    image: docker.io/iabsis/hcw-patient:{{branch_release:dev,latest}}
    ports:
      - "4000:4080"
    environment:
      - BACKEND_URL=http://backend:1337
    depends_on:
      - mongo
      - backend

  doctor:
    image: docker.io/iabsis/hcw-doctor:{{branch_release:dev,latest}}
    ports:
      - "4001:4081"
    environment:
      - BACKEND_URL=http://backend:1337
    depends_on:
      - mongo
      - backend

  admin:
    image: docker.io/iabsis/hcw-admin
    ports:
      - "8002:8082"
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
      - NODE_TLS_REJECT_UNAUTHORIZED=0
      - DB_URI=mongodb://mongo:27017/hcw-athome
      - REDIS_HOST=redis
      - APP_SECRET='myjwtsecret'
      - NODE_ENV=development
      - PUBLIC_URL=https://{{your_local_ip:192.168.1.10}}:4000
      - MAIL_SMTP_HOST=<https://my-smtp-server.ch>/
      - MAIL_SMTP_PORT=465
      - MAIL_SMTP_SECURE=true
      - MAIL_SMTP_SENDER=noreply@hcw-athome.ch
      - MAIL_SMTP_USER=
      - MAIL_SMTP_PASSWORD=
      - LOGIN_METHOD=password
      - DOCTOR_URL=https://{{your_local_ip:192.168.1.10}}:4001
      - MEDIASOUP_URL=https://{{your_local_ip:192.168.1.10}}:3443
      - MEDIASOUP_USER=abcd
      - MEDIASOUP_SECRET=1234
      - BRANDING=LOCAL@Home
      - ACCESSIBILITY_MODE=false
      - ATTACHMENTS_DIR=/data/attachments

    depends_on:
      - mongo
      - redis
    volumes:
      - ./data/attachments:/data/attachments
    restart: always

  redis:
    image: redis


```

## Test

Since all certificates are self signed, you have to open Mediasoup server to accept the certificate first. Then open any one of other URL.

- Mediasoup: https://{{your_local_ip:192.168.1.10}}:3443 (you should have "Cannot GET /" message)
- Doctor URL: https://{{your_local_ip:192.168.1.10}}:4001 (accept the certificate)
- Patient URL: https://{{your_local_ip:192.168.1.10}}:4000 (accept the certificate)
- Admin URL: http://{{your_local_ip:192.168.1.10}}:8002