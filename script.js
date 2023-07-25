// ==UserScript==
// @name         Swagger Auto Auth 0.2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically retrieve auth token and apply to Swagger UI
// @match        https://localhost:5000/swagger/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==
//Replace @match with your swagger url: https://localhost:5000/swagger/*

(function() {
    'use strict';

    // Replace with your authentication API endpoint where you get access token.
    // Example response
    //{
    //"value": {
      //  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIyZWMwMGU1NS0xZTFkLTRkNDktYmUyNS04YzVlMzY1MjZhNjQiLCJVc2VyTmFtZSI6InRhbkB0ZXN0LmNvbSIsInVuaXF1ZV9uYW1lIjoidGFuQHRlc3QuY29tIiwicm9sZSI6WyJBZG1pbmlzdHJhdG9yIiwiUXXhuqNuIFRy4buLIEjhu4cgVGjhu5FuZyJdLCJuYmYiOjE2OTAzMDEwNDksImV4cCI6MTY5MDMwODI0OSwiaWF0IjoxNjkwMzAxMDQ5LCJpc3MiOiJodHRwczovL2J3cy1kZXYtYXBwIiwiYXVkIjoiYml3YXNlIn0.g0MbT7b8Xm8wNb1yV_wv0hXS2AN_hYTiqJkHKWC9_m4",
        //"refreshToken": "EKIrVnRI+RGJQQPwQEj+rX5hHLbYaMmdgJGRxm+BMEY=",
        //"expireInMinute": 120
    //},
    //"statusCode": 200,
    //"contentType": null
    //}
    const authUrl = 'https://localhost:5000/....';

    // Replace with your authentication API with pre-define body parameters
    const authParams = {
        userName: 'username?',
        password: 'password?'
    };

    // Function to retrieve auth token from API
    function getAuthToken() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: authUrl,
            data: JSON.stringify(authParams),
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            onload: function(response) {
                const token = JSON.parse(response.responseText).value.accessToken;
                applyAuthToken(token);
            }
        });
    }

    // Function to apply auth token to Swagger UI
    function applyAuthToken(token) {
        // Open the modal
        openModal();

        // Wait for the modal to open
        setTimeout(function() {
            // Fill in the token
            fillToken(token);
            //Click authorize button
            clickAuthorizeButton();
            // Function to close the modal
            closeModal();
        }, 1000);
    }
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    function openModal() {
        const modalButton = document.evaluate(
            '/html/body/div[1]/section/div[2]/div[2]/div[2]/section/div/button',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (modalButton) {
            modalButton.click();
        }
    }

    function fillToken(token) {
        const input = document.evaluate(
            '/html/body/div[1]/section/div[2]/div[2]/div[2]/section/div/div/div[2]/div/div/div[2]/div/form/div[1]/div[2]/section/input',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        //Bearer + token ???
        setNativeValue(input, token);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function clickAuthorizeButton() {
        const authorizeButton = document.evaluate(
            '/html/body/div/section/div[2]/div[2]/div[2]/section/div/div/div[2]/div/div/div[2]/div/form/div[2]/button[1]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (authorizeButton) {
            authorizeButton.click();
        }
    }

    // Function to close the modal
    function closeModal() {
        const closeButton = document.evaluate(
            '/html/body/div/section/div[2]/div[2]/div[2]/section/div/div/div[2]/div/div/div[2]/div/form/div[2]/button[2]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (closeButton) {
            closeButton.click();
        }
    }

    // Run the script after the page loads
    window.addEventListener('load', function() {
        getAuthToken();
    });
})();
