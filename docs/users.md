# Create the first admin user

In the event of you use login and password credential, you might need to have an admin or a doctor role. The backend doesn't create any user, so you will need to do a small Mongo request.

If you deployed HCW@Home with Debian/Ubuntu or Redhat/Rocky package, just enter in Mongo with `mongosh` command. If you used Docker, you can connect in Mongo Shell with `docker compose exec -ti mongo mongosh`. You can now run the following requests to get your first user.

### Select the right database

```
use hcw-athome # Replace here if you changed the database name
```

### Create an admin user

The admin user will able to connect on admin and also on doctor interface. Be carefull to never create more than one user with same email, email is unique in database.

```
db.user.insertOne({email:"replace-by-your-email",  firstName:"replace-by-your-firstname", lastName:"replace-by-your-lastname", password: "$2b$10$uixuJK9bmstlDRrkp3XJV.y8r00UeD.Gmf9/sjundnbJ7BAB3qjyG", role: "admin",  createdAt: new Date().getTime(), "updatedAt": new Date().getTime(), "username" : "", phoneNumber: "+41..."})
```

You can now login with your email and 'admin' as password.

### Delete a user

```
db.user.deleteOne({email:"replace-by-your-email"})
```