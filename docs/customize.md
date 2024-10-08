
# How to customize HCW@Home

Since version 5.0, it's possible to customize the interface of HCW@Home.

The following components can be customized:

- The logo: 
    - displayed on the home page and login page of the patient interface.
    - displayed on the doctor's application.
- The primary color:
    - display in various location of both patient and doctor interface. The primary color can be chosen for each interface.
- The Home page message:
    - Visible on the left pane of the patient page screen.
- The Login page message:
    - Visible on the left pane of the consultation requester login page.
- The terms and conditions:
    - Visible on the consultation requester account register page.
-     Visible on the patient home page.

![alt text](image-1.png)

## Configure the logo

The logo must be a browser compatible image (png, svg, jpg, ...) and is simply configured into backend.

```
LOGO=<url>
```

The URL can be relative (e.g if you upload in a folder of the doctor or patient app), or absolute (the logo is hosted somewhere else).

For example with Debian package, you can put into /etc/hcw-athome/hcw-athome.conf.

```
LOGO=/assets/logo.png
```

Then place the logo into the following folder:

- patient: /usr/share/hcw-athome/patient/assets/logo.png
- doctor: /usr/share/hcw-athome/caregiver/assets/logo.png

> Note 1 : You can have different logo this way. If you put the full URL, the same logo will be used for the doctor and patient interface.
> Note 2 : The admin interface doesn't have any possible customization yet.


![alt text](image-2.png)

## Configure the primary color

The primary color changes the accent color into the patient and doctor interface. Patient and doctor interfaces can have different color if required.

The color is configured in the backend:

```
DOCTOR_APP_PRIMARY_COLOR=#523C3D
PATIENT_APP_PRIMARY_COLOR=#523C3D
```

The color of the app.

![alt text](image-3.png)

## Change the branding name

Branding ensures that the patient is using the right instance and also limits the risk of scamming. This branding is used in SMS and patient applications.

```
BRANDING=HCW@Home
```

Here a sample how mail is changed with this branding.

![alt text](image-6.png)

## Override texts and configure terms.

HCW@Home permits to customize and add text into various location of the
patient and the doctor application frontend. This is achieved thanks to
markdown files which allow to have rich text features while keeping
good formatting.

### Doctor interface

#### Footer

Under the folder `/usr/share/hcw-athome/caregiver/assets`, create the file `footer.md`.
You can also provide the translated file into `footer.$lang.md`, by example `footer.fr.md`.

![doctor footer](image-25.png)

#### Terms

Under the folder `/usr/share/hcw-athome/patient/assets`, create the file `terms.md`.
If you need to have terms based on country, you have to create the folder 
`/usr/share/hcw-athome/patient/assets/terms`, and create a file called `countries.json`.

This file must contain the name of the countries (you can also put other text).

``` json
[
  "France",
  "UK"
]
```

And then create all corresponding files:

```
terms.UK.md
terms.France.md
```

### Patient interface

#### Home

You can customize the Home page text visible in the left area.
Under the folder `/usr/share/hcw-athome/patient/assets`, create the file `home.md`.
You can also provide the translated file into `home.$lang.md`, by example `home.fr.md`.

#### Terms

Under the folder `/usr/share/hcw-athome/patient/assets`, create the file `terms.md`.
If you need to have terms based on country, you have to create the folder 
`/usr/share/hcw-athome/patient/assets/terms`, and create a file called `countries.json`.

This file must contain the name of the countries (you can also put other text).

``` json
[
  "France",
  "UK"
]
```

And then create all corresponding files:

```
terms.UK.md
terms.France.md
```