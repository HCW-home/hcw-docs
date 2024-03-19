# Use HCW Python SDK

**HCW Py SDK** is a simple way to interact with Health Care Worker @Home API.

## Installation

```
pip install hcw-py-sdk
```

## Pip package

[https://pypi.org/project/hcw-py-sdk/](https://pypi.org/project/hcw-py-sdk/)

## Example

~~~ python
from hcw_py_sdk import HCW

# Create instance with API info
hcw = HCW(
        base_url='https://{url}/api/v1',
        username='{admin}',
        password='{password}'
    )

# Print the queues
print(hcw.queue.list)
~~~

