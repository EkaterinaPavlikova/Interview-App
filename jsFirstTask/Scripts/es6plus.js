"use strict";
import 'babel-polyfill'
import { testController } from "./testController";

window.onload = function() {


    const testBtn = document.getElementById("test-btn");
    testBtn.onclick = startTest;

    function startTest() {

        testController.getInstance().init();
    }
}