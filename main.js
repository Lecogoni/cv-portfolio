window.onload = function () {
  /* INIT ZONE
  -------------------------------- */

  // init emailJs service
  (function () {
    // https://dashboard.emailjs.com/admin/integration
    emailjs.init("user_tXO4Z0N7aBZN6ncCIBxSp");
  })();

  /* DECLARATION ZONE
  -------------------------------- */

  // portfollio card
  const portfoliosInfos = document.querySelectorAll(".card");
  const portfolioTitles = document.querySelectorAll(".portfolio__item__title");
  // form send button
  const sendBtn = document.getElementById("send-btn");
  // email input in the form
  const email = document.getElementById("email");

  // Store of Buttons use to display cv element details - store it in arrays
  const cvButtonsDetails = document.querySelectorAll(".fa-info-circle");
  const cvBtnDetails = Array.from(cvButtonsDetails);

  // Store div && div content corresponding to each Cv elemnent details
  const cvDivDetails = document.querySelectorAll(".cv__details");
  const cvDivContents = document.querySelectorAll(".cv__details__content");

  /* PORTFOLIO SECTION
  -------------------------------- */

  /** ANIMATION ON PORTFOLLIO CARD - SET EVEN LISTENER
   * move up and down portfolio card info on mouse enter / leave
   * rotate arrow icon by adding / removing class
   */
  portfoliosInfos.forEach((item) => {
    item.addEventListener("mouseenter", (e) => {
      let arrowTitle = item.querySelectorAll(".fa-arrow-circle-up")[0];
      arrowTitle.classList.add("rotate");

      let portfolio = item.querySelector(".portfolio__item__content");
      portfolio.style.top = 0 + "px";
    });
    item.addEventListener("mouseleave", (e) => {
      let arrowTitle = item.querySelectorAll(".fa-arrow-circle-up")[0];
      arrowTitle.classList.remove("rotate");

      let portfolio = item.querySelector(".portfolio__item__content");
      portfolio.style.top = 450 + "px";
    });
  });

  /** SAME ANIMATION ON PORTFOLLIO CARD AS PREVIOUS
   *  event listener based on click on title
   */
  portfolioTitles.forEach((item) => {
    item.addEventListener("click", (e) => {
      let portfolioContent = item.closest("div.portfolio__item__content");
      let arrowTitle = item.querySelectorAll(".fa-arrow-circle-up")[0];

      if (portfolioContent.style.top == "0px") {
        portfolioContent.style.top = 450 + "px";
        arrowTitle.classList.remove("rotate");
      } else {
        portfolioContent.style.top = 0 + "px";
        arrowTitle.classList.add("rotate");
      }
    });
  });

  /* MOODBOARD SECTION
  -------------------------------- */

  // Use to center the overflow X scroll of the moodboard
  const moodboard = document.getElementsByClassName("moodboard")[0];
  moodboard.scrollLeft =
    (moodboard.scrollWidth - document.body.offsetWidth) / 2;

  /* CV SECTION
  -------------------------------- */

  /** Event Listener Click on Cv element details button - more info
   *  set an event listener - get the index of buttons and call the display function with the index
   *  index is use to find which element to display - buttons index === details element index
   */
  cvButtonsDetails.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      displayCvDetails(cvBtnDetails.indexOf(item));
    });
  });

  /* CV SECTION
  -------------------------------- */

  /** DISPLAY CV DETAILS
   * use the params to find witch element to modidy
   * toggle div wrapper size and fade in / out the content
   * @param {*} index is the index of button clic
   */
  function displayCvDetails(index) {
    // close active element and remove class
    if (cvButtonsDetails[index].classList.contains("active")) {
      cvDivDetails[index].style.height = "0px";
      cvDivContents[index].classList.remove("fadeOpacity");
      cvButtonsDetails[index].classList.remove("active");
      // remove active class to all elements
    } else {
      cvButtonsDetails.forEach((item) => {
        item.classList.remove("active");
      });

      cvDivDetails.forEach((item) => {
        item.style.height = "0px";
      });

      cvDivContents.forEach((item) => {
        item.classList.remove("fadeOpacity");
      });
      // get position of element cv__title and info icon to display cvDivContens
      let cvTitlePosition = document
        .querySelectorAll(".cv__title")[0]
        .getBoundingClientRect();
      let cvInfoIconPosition = document
        .querySelectorAll(".fa-info-circle")[0]
        .getBoundingClientRect();
      // define size and margin of cv__details
      cvDivContents[index].style.width =
        cvInfoIconPosition.right - cvTitlePosition.left + "px";
      cvDivContents[index].style.marginLeft = cvTitlePosition.left + "px";
      // open selected element details
      cvDivDetails[index].style.height = "100%";
      cvButtonsDetails[index].classList.add("active");
      setTimeout(() => {
        cvDivContents[index].classList.toggle("fadeOpacity");
      }, 300);
    }
  }

  /** on window resize get dimension, position of CV__title to adjust cv__details
   * On window resize get the position of the elements cv__title
   * and aligned left elements cv__details__content
   */
  window.addEventListener("resize", (e) => {
    let cvTitlePosition = document
      .querySelectorAll(".cv__title")[2]
      .getBoundingClientRect();

    let cvInfoIconPosition = document
      .querySelectorAll(".fa-info-circle")[0]
      .getBoundingClientRect();

    document.querySelectorAll(".cv__details__content").forEach((item) => {
      item.style.width = cvInfoIconPosition.right - cvTitlePosition.left + "px";
      item.style.marginLeft = cvTitlePosition.left + "px";
    });
  });

  /** INTERSECTION OBSERVER
   *
   */
  let observer = new IntersectionObserver(
    function (observables) {
      observables.forEach(function (observable) {
        if (observable.intersectionRatio > 0.1) {
          observable.target.classList.add("reveal");
          observer.unobserve(observable.target);
        }
      });
    },
    {
      threshold: [0.1], // permet d'indiquer la zone à partir de laquelle l'élément devient 'visible'
    }
  );

  // Set an observer on each item with the class hide
  let items = document.querySelectorAll(".hide");
  items.forEach(function (item) {
    observer.observe(item);
  });

  /* CONTACT SECTION
  -------------------------------- */

  // Set event Listener on form submit button
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendEmail();
  });

  /** Event Listener on email input - check at each input
   * display content in red while email doesn't match the regex
   */
  email.addEventListener("input", (e) => {
    if (checkEmail(email.value)) {
      email.style.color = "inherit";
    } else {
      email.style.color = "rgb(255, 65, 99)";
    }
  });
};

/* end of onload
--------------------------------
-------------------------------- */

/* CONTACT ZONE
-------------------------------- */

/** SEND EMAIL
 *
 */
function sendEmail() {
  let templateParams = {
    fullName: document.getElementById("mailer").value,
    email: document.getElementById("email").value.trim().toLowerCase(),
    message: document.getElementById("message").value,
  };

  if (!checkEmail(templateParams.email)) {
    document.getElementById("email-status").style.color = "rgb(255, 65, 99)";
    document.getElementById("email-status").innerHTML =
      "le format de l'email n'est pas valide";
  } else if (document.getElementById("mailer").value.length < 3) {
    document.getElementById("email-status").style.color = "rgb(255, 65, 99)";
    document.getElementById("email-status").innerHTML =
      "Merci de préciser votre nom (minimum 3 caractères)";
  } else if (document.getElementById("message").value.length < 10) {
    document.getElementById("email-status").style.color = "rgb(255, 65, 99)";
    document.getElementById("email-status").innerHTML =
      "Veuillez ajouter un message  - minimum 10 caractères";
  } else {
    setMouseCursor("wait");
    emailjs.send("service_cg01usq", "template_d7rxcb1", templateParams).then(
      function (response) {
        document.getElementById("contact-form").reset();

        console.log("SUCCESS!", response.status, response.text);

        document.getElementById("email-status").style.color =
          "rgb(16, 221, 180)";
        document.getElementById("email-status").innerHTML =
          "Votre email a bien été envoyé. Merci !";
        setMouseCursor("default");
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );
  }
}

function setMouseCursor(cursor) {
  document.body.style.cursor = cursor;
  document.getElementById("mailer").style.cursor = cursor;
  document.getElementById("email").style.cursor = cursor;
  document.getElementById("message").style.cursor = cursor;
  document.getElementById("send-btn").style.cursor = cursor;
}

/** CHECK EMAIL
 * check if the email match a valid format - the regex
 * @param {*} email
 * @returns true or false according if the email match or not the regex
 */
function checkEmail(email) {
  const emailregex =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (email.match(emailregex)) {
    return true;
  } else {
    return false;
  }
}
