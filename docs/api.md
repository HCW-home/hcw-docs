# API documentation

> Warning, this guide will help integration any kind of form, but is probably incomplete. If you looks for all possible endpoint, you might try with [Bruno](bruno.md)

This guide provide you some endpoint documentation with sample of how to use HCW@Home API.

## Response format

Our API is very standard and returns http code in response of all requests:

* 200 : everything went well
* 400 : malformed request
* 401 : unauthorized request
* 500 : server error

## Authenticate as service account

An account must be created with scheduler role. This specific user can bypass the 2FA auth.

* Authentication is done via an email and a password.
* The application returns a jwt token stored in the cookies.
* The header `x-access-token` must be defined with the returned JWT.

#### Method and URL

`POST`: `/api/v1/login-local`

#### Payload

~~~ json
{
	"email": "sample-user@test.com",
	"password": "123456890-very-long-password"
}
~~~

* email : HCW login
* password : HCW password

#### Response

~~~
{
   "message":"Login Successful",
   "user":{
      "email":"aa@bb.cc",
      "username":"",
      "id":"5cb52379a286b24da029a03a",
      "role":"scheduler",
      "firstName":"Muhammed",
      "lastName":"Dev",
      "phoneNumber":"+201065234278",
      "authPhoneNumber":"+201065234289",
      "viewAllQueues":true,
      "doctorClientVersion":"2.0.1-2",
      "notifPhoneNumber":"",
      "enableNotif":false,
      "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhQGJiLmNjIiwidXNlcm5hbWUiOiIiLCJpZCI6IjVjYjUyMzc5YTI4NmIyNGRhMDI5YTAzYSIsInJvbGUiOiJkb2N0b3IiLCJmaXJzdE5hbWUiOiJNdWhhbW1lZCIsImxhc3ROYW1lIjoiRGV2IiwicGhvbmVOdW1iZXIiOiIrMjAxMDY1MjM0Mjc4IiwiYXV0aFBob25lTnVtYmVyIjoiKzIwMTA2NTIzNDI4OSIsInZpZXdBbGxRdWV1ZXMiOnRydWUsImRvY3RvckNsaWVudFZlcnNpb24iOiIyLjAuMS0yIiwibm90aWZQaG9uZU51bWJlciI6IiIsImVuYWJsZU5vdGlmIjpmYWxzZSwiaWF0IjoxNjExMTUyNjc0fQ.sACTa5rpQKO3rURuPgB4oRzBwa2rrO3fiAFNsasVTu4"
   }
}
~~~

## Invite management

### Invite creation on behalf of doctor

An invitation is a link allowing a patient to request a consultation.

#### Method and URL

`POST` `/api/v1/invite`

#### Payload

~~~ json
{
  "emailAddress":"super.patient@example.com",
  "phoneNumber":"+41 123 456 789",
  "language":"fr",
  "doctorLanguage":null,
  "doctorEmail": "super.doctor@example.com",
  "firstName":"Paul",
  "lastName":"Dupont",
  "gender":"male",
  "isPatientInvite":true,
  "sendInvite": true
}
~~~

> Note: only one of phoneNumber or emailAddress is required.

* phoneNumber : mobile phone number in international format of the patient. This will only be useful if the invitation is to be resent to the patient.
* emailAddress : in the event that the patient does not have a mobile number, it is also possible to send him the invitation by email.
* scheduledFor : date and time in ISO format of the date on which the consultation should take place.
* language : patient's language, encoded on two characters
* doctorEmail : email from the doctor's account to which the consultation request will be associated.
* firstName : first name of the patient displayed in the consultation request.
* lastName : patient's last name displayed in the consultation request.
* gender : patient sex displayed in the consultation request (male or female)
* isPatientInvite : it must always be set to true because we are here in the case of a patient invitation.
* sendInvite (optional, default false) : does HUG@Home must take care of sending link to patient by SMS or Email (otherwise API will just return the link).

#### Response

Expected answer : 200 (OK)

~~~ json
{
  "success": true,
  "invite": {
    "createdAt": 1610038815110,
    "updatedAt": 1610038815110,
    "id": "5ff73e1f8f2e5c552b287ff9",
    "firstName": "Olivier",
    "lastName": "Bitsch",
    "gender": "male",
    "phoneNumber": "",
    "emailAddress": "olivier.b@iabsis.com",
    "status": "SENT",
    "scheduledFor": 1610124899000,
    "type": "PATIENT",
    "patientLanguage": "fr",
    "doctorLanguage": "",
    "guestEmailAddress": "",
    "guestPhoneNumber": "",
    "queue": null,
    "invitedBy": "5fac3a1a86668e782041ea70",
    "patientInvite": null,
    "translationOrganization": null,
    "translator": null,
    "translatorRequestInvite": null,
    "translatorInvite": null,
    "guestInvite": null
    "patientURL": "https://app.hug-at-home.ch/...",
    "doctorURL": "https://hug-at-home.ch/..."
  }
}
~~~

### Invite creation assigned to a queue

An invitation is a link allowing a patient to request a consultation.

#### Method and URL

`POST` `/api/v1/invite`

#### Payload

~~~ json
{
  "emailAddress":"",
  "phoneNumber":"+41 123 456 789",
  "scheduledFor":"2021-01-08T16:54:59.000Z",
  "language":"fr",
  "doctorLanguage":null,
  "queue": "Queue name",
  "firstName":"Paul",
  "lastName":"Dupont",
  "gender":"male",
  "isPatientInvite":true
}
~~~

* queue : queue name or id

Refer to the previous section for the other fields.

### Retrieve the information of an invitation

This allows you to retrieve the information from an invitation again.

#### Method and URL

`GET` `/api/v1/invite/{ID}`

### Delete an invitation

This removes the patient invitation. This request is no longer possible when the patient has requested a consultation.

#### Method and URL

`DELETE` `/api/v1/invite/{ID}`

### Invite update

This changes the patient invitation.

#### Method and URL

`PATCH` `/api/v1/invite/{ID}`

For the content, refer to the creation

## Retrieve information from a consultation

Once an invitation has been used by a patient, it is possible to retrieve information concerning it.

> Warning !! this automatically closes the consultation and patient/doctor will not able to use it anymore !!

`POST` `/api/v1/invite/{ID}/consultation/close`

#### Response

~~~ json
{
  "_id": "6005b7c37e71bb4c879ff56a",
  "queue": "5e6df5c63f25c958e1f43c30",
  "gender": "male",
  "IMADTeam": "none",
  "invitationToken": "b531e8f67d24546d0bf0348b97518977261e732c",
  "status": "closed",
  "owner": "5cb52379a286b24da029a03a",
  "firstName": "Muhammed",
  "lastName": "abozaid",
  "invitedBy": "5cb52379a286b24da029a03a",
  "invite": "6005b7b77e71bb4c879ff569",
  "createdAt": 1610987459810,
  "updatedAt": 1611044353974,
  "birthDate": "",
  "type": "",
  "acceptedBy": null,
  "translator": null,
  "guest": null,
  "acceptedAt": 0,
  "closedAt": 0,
  "patientRating": "",
  "patientComment": "",
  "doctorRating": "",
  "doctorComment": "",
  "flagPatientOnline": false,
  "flagGuestOnline": false,
  "flagTranslatorOnline": false,
  "flagDoctorOnline": true,
  "scheduledFor": 0
}
~~~

### Single Sign-On service

This process permit to issue JWT token thanks to a shared key. This endpoint requires to have `SHARED_EXTERNAL_AUTH_SECRET` variable defined into backend.

1. Create a JWT token containing the following content, use the shared key previously defined.

~~~ json
{
   "email":"email",
   "timestamp": {timestamp}
}
~~~

* email: email you want to login as
* timestamp: timestamp not later than 5 minutes

2. Use the following POST URL to authenticate user.

> `POST` : `/api/v1/external-auth-callback?token={JWT}&returnUrl={URL}`

* JWT : token previously created
* URL : optional redirect URL, otherwise return to user Dashboard.

