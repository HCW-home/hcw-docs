# Troubleshooting

### ERROR 1: Error initializing clamscan: Error: connect ENOENT /var/run/clamav/clamd.ctl

```
Error initializing clamscan: Error: connect ENOENT /var/run/clamav/clamd.ctl
at PipeConnectWrap.afterConnect [as oncomplete] (node:net:1278:16) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'connect',
  address: '/var/run/clamav/clamd.ctl'
}
```

Check Clamv socket exists with:

```
ls -l /var/run/clamav/clamd.ctl
```

If not, check the clamav-daemon service is running properly.

### ERROR 2: Error: connect ECONNREFUSED 127.0.0.1:6379

```
error: A hook (`session`) failed to load!
error: Could not tear down the ORM hook.  Error details: Error: Consistency violation: Attempting to tear down a datastore (`default`) which is not currently registered with this adapter.  This is usually due to a race condition in userland code (e.g. attempting to tear down the same ORM instance more than once), or it could be due to a bug in this adapter.  (If you get stumped, reach out at http://sailsjs.com/support.)
    at Object.teardown (/usr/share/hcw-athome/backend/node_modules/sails-mongo/lib/index.js:390:19)
    at /usr/share/hcw-athome/backend/node_modules/waterline/lib/waterline.js:767:27
    at /usr/share/hcw-athome/backend/node_modules/async/dist/async.js:3113:16
    at eachOfArrayLike (/usr/share/hcw-athome/backend/node_modules/async/dist/async.js:1072:9)
    at eachOf (/usr/share/hcw-athome/backend/node_modules/async/dist/async.js:1120:5)
    at Object.eachLimit (/usr/share/hcw-athome/backend/node_modules/async/dist/async.js:3175:5)
    at Object.teardown (/usr/share/hcw-athome/backend/node_modules/waterline/lib/waterline.js:751:11)
    at Hook.teardown (/usr/share/hcw-athome/backend/node_modules/sails-hook-orm/index.js:246:30)
    at Sails.wrapper (/usr/share/hcw-athome/backend/node_modules/@sailshq/lodash/lib/index.js:3282:19)
    at Object.onceWrapper (node:events:627:28)
    at Sails.emit (node:events:513:28)
    at Sails.emit (node:domain:489:12)
    at https://sails.emitter.emit/ (/usr/share/hcw-athome/backend/node_modules/sails/lib/app/private/after.js:56:26)
    at /usr/share/hcw-athome/backend/node_modules/sails/lib/app/lower.js:67:11
    at beforeShutdown (/usr/share/hcw-athome/backend/node_modules/sails/lib/app/lower.js:45:12)
    at Sails.lower (/usr/share/hcw-athome/backend/node_modules/sails/lib/app/lower.js:49:3)
error: Failed to lift app: Error: connect ECONNREFUSED 127.0.0.1:6379
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1278:16)
```

Check Redis server is working correctly.