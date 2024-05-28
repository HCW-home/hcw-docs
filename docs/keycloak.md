# Configure HCW@Home with Keycloak

## Introduction

HCW@Home officially and natively supports OpenID authentication as client. This guide will help you to configure Keycloak as part of SSO service with HCW@Home. Note it's possible to integrate any king of OpenID provider and has been successfully tested with Microsoft 365.

Note that OpenID is used in Doctor, Admin and Requester interface.

## Requirements

* Having a working instance of Keycloak and configured **Realm**.
* Having a deploy HCW@Home instance.

## Adding new client in Keycloak

The first step is simply to add Keycloak client for HCW@Home.

* Open the right **Realm**.
* Under **Client**, click on **Create client** button.
* Fill the form
    * Client type: **OpenID Connect**
    * Client ID: choose an id, by example **hcw-athome**.
* Click on **Next** and continue with:
    * Client authentication: **On**
    * Authorization: **Off**
    * Authentication flow: to keep default (**Standard flow** and **Direct access grants**)
* Click on **Next** and continue with:
    * Root URL: give the doctor URL (e.g. **https://access-hcw.example.com**)
    * Home URL: you can keep empty
    * Valid redirect URIs: provide a list of the three doctor, patient and admin URL. Don't forget to add **/\*** at the end of the URL (e.g. **https://access-hcw.example.com/\***, **https://app-hcw.example.com/\***, ...)
* Click on **Save**

Now keep back the following important values as we will need them later.

* Realm: the one you choose before creating a client.
* Client ID: the one you define when creating client.
* Client Secret: go to tag **Credentials** and copy the **Client secret** key.
* Your keycloak root URL: just look at the URL in your browser (e.g. https://auth.example.com).

## Configure HCW@Home

Now you have configured the client in Keycloak, HCW@Home configuration should be quite straightforward.

Edit the HCW@Home configuration file (e.g. `/etc/hcw-athome/hcw-athome.conf`) and add/edit or uncomment the following keys. Don't forget to replace `<realm>`, `<keycloak root url>`, `<client id>` and `<client secret>` according to your Keycloak configuration.

```
# Change from password to openid (you can easily rollback if OpenID is not working)
LOGIN_METHOD=openid

# Standard OpenID values
OPENID_ISSUER_BASE_URL=https://<keycloak root url>/realms/<realm>
OPENID_CLIENT_ID=<client id>
OPENID_CLIENT_SECRET=<client secret>
OPENID_CALLBACK_URL=/api/v1/login-openid/callback
OPENID_AUTHORIZATION_URL=https://<keycloak root url>/realms/<realm>/protocol/openid-connect/auth
OPENID_TOKEN_URL=https://<keycloak root url>/realms/<realm>/protocol/openid-connect/token
OPENID_USER_INFO_URL=https://<keycloak root url>/realms/<realm>/protocol/openid-connect/userinfo
OPENID_LOGOUT_URL=https://<keycloak root url>/realms/<realm>/protocol/openid-connect/logout

# Keep false if you still want to create users into admin interface,
# otherwise any user will be able to use HCW@Home.
OPENID_AUTOCREATE_USER=true
```

Now restart the backend

```
systemctl restart hcw-athome
```