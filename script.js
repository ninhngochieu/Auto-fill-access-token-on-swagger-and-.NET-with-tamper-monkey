// ==UserScript==
// @name         Swagger Auto Auth 0.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically retrieve auth token and apply to Swagger UI
// @match        https://localhost:5000/swagger/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==
//Replace @match with your swagger url: https://localhost:5000/swagger/*

(function() {
    'use strict';

    // Replace with your authentication API endpoint where you get access token.
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
