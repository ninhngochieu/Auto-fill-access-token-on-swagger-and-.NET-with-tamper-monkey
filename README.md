# Swagger Auto Auth 0.1

This is a Tampermonkey userscript that automatically retrieves an authentication token and applies it to Swagger UI. It is designed to work with the Swagger UI hosted at `https://localhost:5001/swagger/*`.

## Usage

1. Install the Tampermonkey browser extension.
2. Install this script by clicking on the "Raw" button on the GitHub page.
3. Replace the `authUrl` and `authParams` values in the script with your authentication API endpoint and parameters.
4. When you visit the Swagger UI page, the script will automatically retrieve an authentication token, open the authorization modal, fill in the token, and close the modal.

## How it works

The script uses the `GM_xmlhttpRequest` function provided by Tampermonkey to make a POST request to the authentication API endpoint specified in `authUrl`, with the parameters specified in `authParams`. The response is expected to contain a JSON object with an `accessToken` property.

The script then uses various DOM manipulation techniques to open the authorization modal, fill in the token, and close the modal.

### Request Sample

Here is a sample request to retrieve an authentication token:

```json
{
  "password": "Your password here!",
  "userName": "Your username here!"
}
```

### Response Sample

Here is a sample response containing an authentication token:

```json
{
    "value": {
      "accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5,
        "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5,
        "expireInMinute": 120
    },
    "statusCode": 200,
    "contentType": null
}
```

## Notes

- This script is intended for use with a specific Swagger UI instance and may not work with other instances without modification.
- The script currently only supports bearer token authentication.
- The script may need to be updated if the structure of the Swagger UI page changes.

I hope this helps! Let me know if you have any questions or need further assistance. 😊
