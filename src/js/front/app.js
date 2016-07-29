'use strict';

function main() {
  console.log("running");

  chrome.runtime.sendMessage({}, (response) => {
    console.log(response);
  });
}


main();
