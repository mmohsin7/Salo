$(document).ready(function () {

  function isUserLoggedIn() {
    const userId = localStorage.getItem("UserID");
    return userId !== null;
  }

  if(!isUserLoggedIn())
  {
      window.location.replace("../index.html");
  }

  $('#toggleBtn').click(function () {
    const isMobile = $(window).width() <= 768;

    if (isMobile) {
      $('#sidebar').toggleClass('show');
      $('.sidebar-bg').toggleClass('show');
      $('.top-bar').toggleClass('sidebar-bg-show');
      $('.sidebar').toggleClass('sidebar-bg-show');
    } else {
      $('#sidebar').toggleClass('collapsed');
    }
  });

  // Optional: hide sidebar on outside click (mobile)
  $('.sidebar-bg').click(function (e) {
    const isMobile = $(window).width() <= 768;
    if (
      isMobile &&
      !$(e.target).closest('#sidebar, #toggleBtn').length
    ) {
      $('#sidebar').removeClass('show');
      $('.sidebar-bg').removeClass('show');
      $('.top-bar').removeClass('sidebar-bg-show');
      $('.sidebar').removeClass('sidebar-bg-show');
    }
  });

  var sidebarLabelsList = ['Companies', 'Products', 'Order Bookers', 'Customers', 'Purchases', 'Manage Purchases', 'Sales', 'Manage Sales'];
  $('.sidebar-content .content').hide().eq(0).fadeIn().addClass('active');
  $('#sidebar-content-label').text(sidebarLabelsList[0]);

  $('.sidebar li').click(function () {
    const index = $(this).index();

    // Update active class on li
    $('.sidebar li').removeClass('active');
    $(this).addClass('active');

    // Animate content switch
    const current = $('.sidebar-content .content.active');
    const next = $('.sidebar-content .content').eq(index);
    $('#sidebar-content-label').text(sidebarLabelsList[index]);

    if (current[0] !== next[0]) {
      current.fadeOut(200, function () {
        $(this).removeClass('active');
        next.fadeIn(200).addClass('active');
      });
    }
  });

  const $dropdownBtn = $('#account-setting-image-button');
  const $dropdownCard = $('#dropdownCard');

  $dropdownBtn.click(function (e) {
    e.stopPropagation(); // Prevent body click
    $dropdownCard.toggleClass('show');
  });

  // Hide dropdown if clicked outside
  $(document).click(function (e) {
    if (!$(e.target).closest('#dropdownCard, #account-setting-image-button').length) {
      $dropdownCard.removeClass('show');
    }
  });

  var PopupBox = $("#message-popup");
  function OpenPopup(icon, header, description) {
    document.body.classList.add("no-scroll");
    $("#popup-header-icon").attr('src',icon);
    $("#popup-header-title").text(header);
    $("#popup-description").text(description);
    PopupBox.addClass("show");
  }

  $("#message-popup-button").click(
    function()
    {
        ClosePopup();
    }
  );

  $("#close-message-popup").click(
    function()
    {
        ClosePopup();
    }
  );
      
  function ClosePopup() {
    document.body.classList.remove("no-scroll");
    PopupBox.removeClass("show");
  }

  // firebase
  const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..."
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  const userEmail = localStorage.getItem("UserID");
  db.collection("Users").doc(userEmail).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      $('#userName').text(data.name);
      $('#userEmail').text(data.email);
      $('.userImage').attr("src", `data:image/png;base64,${data.image}`);
    } else {
      console.log("No such user!");
    }
  }).catch((error) => {
    console.error("Error getting user document:", error);
  });

  $('#change-password-button').click(
    function()
    {
      firebase.auth().sendPasswordResetEmail(userEmail)
      .then(() => {
        OpenPopup(
          "../assets/icons/success.svg",
          "Email sent",
          `Reset password email send successfully to ${userEmail}`
      );
      })
      .catch((error) => {
          const errorCode = error.code;

          if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
              OpenPopup(
                  "../assets/icons/failed.svg",
                  "Error",
                  "Invalid email, please enter valid email for reset password"
              );
          } else if (errorCode === 'auth/network-request-failed') {
              OpenPopup(
                  "../assets/icons/failed.svg",
                  "Network failed",
                  "Check your internet connection and try again."
              );
          } else {
              OpenPopup(
                  "../assets/icons/failed.svg",
                  "Error",
                  "Something went wrong!, please try again later."
              );
          }
      });
    }
  );

  $('#logout-button').click(
    function()
    {
      localStorage.clear();
      window.location.replace("../index.html");
    }
  )



  // company section

  // add company popup
  function OpenAddEditCompanyPopup(header) {
    document.body.classList.add("no-scroll");
    $("#add-edit-company-popup-header-title").text(header);
    $("#add-edit-company-popup").addClass("show");
  }

  $("#close-add-edit-company-popup").click(
    function()
    {
      $('#add-edit-company-form')[0].reset();
      CloseAddEditCompanyPopup();
    }
  );
      
  function CloseAddEditCompanyPopup() {
    document.body.classList.remove("no-scroll");
    $("#add-edit-company-popup").removeClass("show");
  }

  // edit company popup
  function OpenEditCompanyPopup(name, location, contact, companyID) {
    document.body.classList.add("no-scroll");
    $("#add-edit-company-popup-header-title").text("Edit Company");
    $("#company-name").val(name);
    $("#company-location").val(location);
    $("#company-contact").val(contact);
    $('#add-edit-company-form').data('id', companyID);
    $("#add-edit-company-popup").addClass("show");
  }

  // delete company popup
  function OpenDeleteCompanyPopup(description, companyID) {
    document.body.classList.add("no-scroll");
    $("#delete-company-popup-description").text(description);
    $('#delete-company-ok-popup-button').data('id', companyID);
    $("#delete-company-popup").addClass("show");
  }

  $("#close-delete-company-popup").click(
    function()
    {
      CloseDeleteCompanyPopup();
    }
  );

  $("#delete-company-cancel-popup-button").click(
    function()
    {
      CloseDeleteCompanyPopup();
    }
  );
      
  function CloseDeleteCompanyPopup() {
    document.body.classList.remove("no-scroll");
    $("#delete-company-popup").removeClass("show");
  }

  $('#add-company-button').click(
    function()
    {
      OpenAddEditCompanyPopup("Add Company");
    }
  );

  $('#add-edit-company-form').submit(function(event)
  {
    event.preventDefault();
    let companyName = $("#company-name").val().trim();
    let companyLocation = $("#company-location").val().trim();
    let companyContact = $("#company-contact").val().trim();
    const companyData = {
      name: companyName,
      location: companyLocation,
      contact: companyContact
    };

    const companyDocId = $('#add-edit-company-form').data('id');

    $('#add-edit-company-form')[0].reset();
    CloseAddEditCompanyPopup();

    if(companyDocId === undefined)
    {
      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Companies")
      .add(companyData)
      .then((docRef) => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });

    }
    else
    {
      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Companies")
      .doc(companyDocId)
      .update(companyData)
      .then(() => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });

      $('#add-edit-company-form').data('id', companyID);
    }
  });

  const companiesRef = firebase.firestore()
  .collection("Users")
  .doc(userEmail)
  .collection("Companies");

  companiesRef.onSnapshot((snapshot) => {
    $('#companies-list').empty();

    $('#companies-count').text(`${snapshot.size}`);

    if (snapshot.empty) {
      $('#companies-list').append('<p style="position:absolute;width:100%;height:calc(100% - 145px);display: flex;align-items: center;justify-content: center;text-align:center;">No companies found.</p>');
      return;
    }

    snapshot.forEach((doc) => {
      const company = doc.data();
      const html = `
        <div class="company-card">
          <h3>${company.name}</h3>
          <p><img src="../assets/icons/location.svg">${company.location}</p>
          <p><img src="../assets/icons/contact.svg">${company.contact}</p>
          <div class="company-card-buttons">
            <button class="edit-company-from-card" data-id="${doc.id}"><img src="../assets/icons/edit.svg"></button>
            <button class="delete-company-from-card" data-id="${doc.id}"><img src="../assets/icons/remove.svg"></button>
          </div>
        </div>
      `;
      $('#companies-list').append(html);
    });
  });

  $(document).on('click', '.delete-company-from-card', function() {
    const docId = $(this).data('id');
    OpenDeleteCompanyPopup("Are you sure you want to delete this company?", docId);
  });

  $(document).on('click', '.edit-company-from-card', function() {
    const companyDocId = $(this).data('id');
    var name;
    var location;
    var contact;
    firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Companies")
    .doc(companyDocId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const companyData = doc.data();
        name = companyData.name;
        location = companyData.location;
        contact = companyData.contact;
        OpenEditCompanyPopup(name, location, contact, companyDocId);
      }
    });
  });

  $('#delete-company-ok-popup-button').click(
    function()
    {
      const companyDocId = $(this).data('id');
      
      CloseDeleteCompanyPopup();

      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Companies")
      .doc(companyDocId)
      .delete()
      .then(() => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });
    }
  );



  // orderbooker section

  // add orderbooker popup
  function OpenAddEditorderbookerPopup(header) {
    document.body.classList.add("no-scroll");
    $("#add-edit-orderbooker-popup-header-title").text(header);
    $("#add-edit-orderbooker-popup").addClass("show");
  }

  $("#close-add-edit-orderbooker-popup").click(
    function()
    {
      $('#add-edit-orderbooker-form')[0].reset();
      CloseAddEditorderbookerPopup();
    }
  );
      
  function CloseAddEditorderbookerPopup() {
    document.body.classList.remove("no-scroll");
    $("#add-edit-orderbooker-popup").removeClass("show");
  }

  // edit orderbooker popup
  function OpenEditorderbookerPopup(name, address, contact, orderbookerID) {
    document.body.classList.add("no-scroll");
    $("#add-edit-orderbooker-popup-header-title").text("Edit order booker");
    $("#orderbooker-name").val(name);
    $("#orderbooker-address").val(address);
    $("#orderbooker-contact").val(contact);
    $('#add-edit-orderbooker-form').data('id', orderbookerID);
    $("#add-edit-orderbooker-popup").addClass("show");
  }

  // delete orderbooker popup
  function OpenDeleteorderbookerPopup(description, orderbookerID) {
    document.body.classList.add("no-scroll");
    $("#delete-orderbooker-popup-description").text(description);
    $('#delete-orderbooker-ok-popup-button').data('id', orderbookerID);
    $("#delete-orderbooker-popup").addClass("show");
  }

  $("#close-delete-orderbooker-popup").click(
    function()
    {
      CloseDeleteorderbookerPopup();
    }
  );

  $("#delete-orderbooker-cancel-popup-button").click(
    function()
    {
      CloseDeleteorderbookerPopup();
    }
  );
      
  function CloseDeleteorderbookerPopup() {
    document.body.classList.remove("no-scroll");
    $("#delete-orderbooker-popup").removeClass("show");
  }

  $('#add-orderbooker-button').click(
    function()
    {
      OpenAddEditorderbookerPopup("Add order booker");
    }
  );

  $('#add-edit-orderbooker-form').submit(function(event)
  {
    event.preventDefault();
    let orderbookerName = $("#orderbooker-name").val().trim();
    let orderbookeraddress = $("#orderbooker-address").val().trim();
    let orderbookerContact = $("#orderbooker-contact").val().trim();
    const orderbookerData = {
      name: orderbookerName,
      address: orderbookeraddress,
      contact: orderbookerContact
    };

    const orderbookerDocId = $('#add-edit-orderbooker-form').data('id');

    $('#add-edit-orderbooker-form')[0].reset();
    CloseAddEditorderbookerPopup();

    if(orderbookerDocId === undefined)
    {
      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Orderbookers")
      .add(orderbookerData)
      .then((docRef) => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });
    }
    else
    {
      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Orderbookers")
      .doc(orderbookerDocId)
      .update(orderbookerData)
      .then(() => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });

      $('#add-edit-orderbooker-form').data('id', orderbookerID);
    }
  });

  const orderbookersRef = firebase.firestore()
  .collection("Users")
  .doc(userEmail)
  .collection("Orderbookers");

  orderbookersRef.onSnapshot((snapshot) => {
    $('#orderbookers-list').empty();

    $('#orderbookers-count').text(`${snapshot.size}`);

    if (snapshot.empty) {
      $('#orderbookers-list').append('<p style="position:absolute;width:100%;height:calc(100% - 145px);display: flex;align-items: center;justify-content: center;text-align:center;">No order bookers found.</p>');
      return;
    }

    snapshot.forEach((doc) => {
      const orderbooker = doc.data();
      const html = `
        <div class="orderbooker-card">
          <h3>${orderbooker.name}</h3>
          <p><img src="../assets/icons/location.svg">${orderbooker.address}</p>
          <p><img src="../assets/icons/contact.svg">${orderbooker.contact}</p>
          <div class="orderbooker-card-buttons">
            <button class="edit-orderbooker-from-card" data-id="${doc.id}"><img src="../assets/icons/edit.svg"></button>
            <button class="delete-orderbooker-from-card" data-id="${doc.id}"><img src="../assets/icons/remove.svg"></button>
          </div>
        </div>
      `;
      $('#orderbookers-list').append(html);
    });
  });

  $(document).on('click', '.delete-orderbooker-from-card', function() {
    const docId = $(this).data('id');
    OpenDeleteorderbookerPopup("Are you sure you want to delete this order booker?", docId);
  });

  $(document).on('click', '.edit-orderbooker-from-card', function() {
    const orderbookerDocId = $(this).data('id');
    var name;
    var address;
    var contact;
    firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Orderbookers")
    .doc(orderbookerDocId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const orderbookerData = doc.data();
        name = orderbookerData.name;
        address = orderbookerData.address;
        contact = orderbookerData.contact;
        OpenEditorderbookerPopup(name, address, contact, orderbookerDocId);
      }
    });
  });

  $('#delete-orderbooker-ok-popup-button').click(
    function()
    {
      const orderbookerDocId = $(this).data('id');
      
      CloseDeleteorderbookerPopup();

      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Orderbookers")
      .doc(orderbookerDocId)
      .delete()
      .then(() => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });
    }
  );




  // product section

  let companies = [];

  // Fetch companies once
  firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Companies")
    .onSnapshot((snapshot) => {
      companies = []; // reset
      snapshot.forEach((doc) => {
        companies.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      renderProductDropdown(companies); // initial render
    });

  // Render filtered list
  function renderProductDropdown(list) {

    const $dropdown = $('#companyDropdown');
    $dropdown.empty();
    if (list.length === 0) {
      $dropdown.append('<li>No results found</li>');
    } else {
      list.forEach((company) => {
        $dropdown.append(`<li data-id="${company.id}">${company.name}</li>`);
      });
    }
    $dropdown.show();
  }

  // Filter on input
  $('#companySearchInput').on('input', function () {
    const search = $(this).val().toLowerCase();
    const filtered = companies.filter(c => c.name.toLowerCase().includes(search));
    renderProductDropdown(filtered);
  });

  // Show dropdown on focus (even with no input)
  $('#companySearchInput').on('focus', function () {
    renderProductDropdown(companies);
  });

  // Handle selection
  $(document).on('click', '#companyDropdown li', function () {
    const name = $(this).text();
    const id = $(this).data('id');
    $('#companySearchInput').val(name);
    $("#companySearchInput").data('id', id);
    $('#companyDropdown').hide();
  });

  // Hide dropdown if focus leaves and no valid selection
  $(document).on('click', function (e) {
    const target = $(e.target);
    if (!target.closest('.company-search-wrapper').length) {
      const input = $('#companySearchInput');
      const val = input.val();
      const matched = companies.find(c => c.name === val);
      if (!matched) {
        input.val('').removeAttr('data-id');
      }
      $('#companyDropdown').hide();
    }
  });

  // add product popup
function OpenAddEditproductPopup(header) {
  document.body.classList.add("no-scroll");
  $("#add-edit-product-popup-header-title").text(header);
  $("#product-company-label").show();
  $("#product-company").show();
  $("#add-edit-product-popup").addClass("show");
}

$("#close-add-edit-product-popup").click(
  function()
  {
    $('#add-edit-product-form')[0].reset();
    CloseAddEditproductPopup();
  }
);
    
function CloseAddEditproductPopup() {
  document.body.classList.remove("no-scroll");
  $("#add-edit-product-popup").removeClass("show");
}

// edit product popup
function OpenEditproductPopup(name, perboxprice, productID) {
  document.body.classList.add("no-scroll");
  $("#add-edit-product-popup-header-title").text("Edit product");
  $("#product-name").val(name);
  $("#product-company").hide();
  $("#product-company-label").hide();
  $("#product-perboxprice").val(perboxprice);
  $('#add-edit-product-form').data('id', productID);
  $("#add-edit-product-popup").addClass("show");
}

// delete product popup
function OpenDeleteproductPopup(description, productID) {
  document.body.classList.add("no-scroll");
  $("#delete-product-popup-description").text(description);
  $('#delete-product-ok-popup-button').data('id', productID);
  $("#delete-product-popup").addClass("show");
}

$("#close-delete-product-popup").click(
  function()
  {
    CloseDeleteproductPopup();
  }
);

$("#delete-product-cancel-popup-button").click(
  function()
  {
    CloseDeleteproductPopup();
  }
);
    
function CloseDeleteproductPopup() {
  document.body.classList.remove("no-scroll");
  $("#delete-product-popup").removeClass("show");
}

$('#add-product-button').click(
  function()
  {
    OpenAddEditproductPopup("Add product");
  }
);

$('#add-edit-product-form').submit(function(event)
{
  event.preventDefault();
  let productName = $("#product-name").val().trim();
  let productCompany = $("#companySearchInput").data('id');
  let productPerboxprice = $("#product-perboxprice").val().trim();
  const productData = {
    name: productName,
    company: productCompany,
    perboxprice: productPerboxprice
  };

  const productDocId = $('#add-edit-product-form').data('id');

  $('#add-edit-product-form')[0].reset();
  CloseAddEditproductPopup();

  if(productDocId === undefined)
  {
    firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Products")
    .add(productData)
    .then((docRef) => {
    })
    .catch((error) => {
      OpenPopup(
        "../assets/icons/failed.svg",
        "Error",
        "Something went wrong!, please try again later."
      );
    });
  }
  else
  {
    const productData = {
      name: productName,
      perboxprice: productPerboxprice
    };
    firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Products")
    .doc(productDocId)
    .update(productData)
    .then(() => {
    })
    .catch((error) => {
      OpenPopup(
        "../assets/icons/failed.svg",
        "Error",
        "Something went wrong!, please try again later."
      );
    });

    $('#add-edit-product-form').data('id', '');
    $("#companySearchInput").data('id', '');
  }
});

const productsRef = firebase.firestore()
.collection("Users")
.doc(userEmail)
.collection("Products");

productsRef.onSnapshot((snapshot) => {
  $('#products-list').empty();

  $('#products-count').text(`${snapshot.size}`);

  if (snapshot.empty) {
    $('#products-list').append('<p style="position:absolute;width:100%;height:calc(100% - 145px);display: flex;align-items: center;justify-content: center;text-align:center;">No products found.</p>');
    return;
  }

  snapshot.forEach((doc) => {
    const product = doc.data();
    var companyName;
    firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Companies")
    .doc(product.company)
    .get()
    .then((pdoc) => {
      if (pdoc.exists) {
        const companyData = pdoc.data();
        companyName = companyData.name;

        const html = `
        <div class="product-card">
          <h3>${product.name}</h3>
          <p><img src="../assets/icons/Sidebar_Companies.svg">${companyName}</p>
          <p><img src="../assets/icons/price.svg">${product.perboxprice}</p>
          <div class="product-card-buttons">
            <button class="edit-product-from-card" data-id="${doc.id}"><img src="../assets/icons/edit.svg"></button>
            <button class="delete-product-from-card" data-id="${doc.id}"><img src="../assets/icons/remove.svg"></button>
          </div>
        </div>
        `;

        const html2 = `
        <div data-id="${doc.id}" class="product-card">
          <h3>${product.name}</h3>
          <p><img src="../assets/icons/Sidebar_Companies.svg">${companyName}</p>
          <p><img src="../assets/icons/price.svg">${product.perboxprice}</p>
          <label for="purchase-product-box">Boxes</label>
          <input id="purchase-product-box" data-id="${product.perboxprice}" class="purchases-product-boxes" type="number" placeholder="Enter boxes ..."/>
          <p>Total Price  Rs.<span id="total-product-price">0</span></p>
        </div>
        `;
        $('#products-list').append(html);
        $('#sales-products-list').append(html2);
      }
    });
  });
});

$(document).on('change input', '.purchases-product-boxes', function() {
  var perBoxPrice = $(this).data('id');
  var numberOfBoxes = $(this).val();
  var totalPrice = perBoxPrice * numberOfBoxes;
  $(this).closest('div, form, section').find('#total-product-price').text(totalPrice);
});

$(document).on('click', '.delete-product-from-card', function() {
  const docId = $(this).data('id');
  OpenDeleteproductPopup("Are you sure you want to delete this product?", docId);
});

$(document).on('click', '.edit-product-from-card', function() {
  const productDocId = $(this).data('id');
  var name;
  var perboxprice;
  firebase.firestore()
  .collection("Users")
  .doc(userEmail)
  .collection("Products")
  .doc(productDocId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const productData = doc.data();
      name = productData.name;
      perboxprice = productData.perboxprice;
      OpenEditproductPopup(name, perboxprice, productDocId);
    }
  });
});

$('#delete-product-ok-popup-button').click(
  function()
  {
    const productDocId = $(this).data('id');
    
    CloseDeleteproductPopup();

    firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Products")
    .doc(productDocId)
    .delete()
    .then(() => {
    })
    .catch((error) => {
      OpenPopup(
        "../assets/icons/failed.svg",
        "Error",
        "Something went wrong!, please try again later."
      );
    });
  }
);




    // customer section

    let orderbookers = [];

    // Fetch orderbookers once
    firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Orderbookers")
      .onSnapshot((snapshot) => {
        orderbookers = []; // reset
        snapshot.forEach((doc) => {
          orderbookers.push({
            id: doc.id,
            name: doc.data().name
          });
        });
        renderOrderBookerDropdown(orderbookers); // initial render
      });

    // Render filtered list
    function renderOrderBookerDropdown(list) {
      const $dropdown = $('#orderbookerDropdown');
      $dropdown.empty();
      if (list.length === 0) {
        $dropdown.append('<li>No results found</li>');
      } else {
        list.forEach((orderbooker) => {
          $dropdown.append(`<li data-id="${orderbooker.id}">${orderbooker.name}</li>`);
        });
      }
      $dropdown.show();
    }

    // Filter on input
    $('#orderbookerSearchInput').on('input', function () {
      const search = $(this).val().toLowerCase();
      const filtered = orderbookers.filter(c => c.name.toLowerCase().includes(search));
      renderOrderBookerDropdown(filtered);
    });

    // Show dropdown on focus (even with no input)
    $('#orderbookerSearchInput').on('focus', function () {
      renderOrderBookerDropdown(orderbookers);
    });

    // Handle selection
    $(document).on('click', '#orderbookerDropdown li', function () {
      const name = $(this).text();
      const id = $(this).data('id');
      $('#orderbookerSearchInput').val(name);
      $("#orderbookerSearchInput").data('id', id);
      $('#orderbookerDropdown').hide();
    });

    // Hide dropdown if focus leaves and no valid selection
    $(document).on('click', function (e) {
      const target = $(e.target);
      if (!target.closest('.orderbooker-search-wrapper').length) {
        const input = $('#orderbookerSearchInput');
        const val = input.val();
        const matched = orderbookers.find(c => c.name === val);
        if (!matched) {
          input.val('').removeAttr('data-id');
        }
        $('#orderbookerDropdown').hide();
      }
    });

    // add customer popup
    function OpenAddEditcustomerPopup(header) {
    document.body.classList.add("no-scroll");
    $("#add-edit-customer-popup-header-title").text(header);
    $("#customer-orderbooker-label").show();
    $("#customer-orderbooker").show();
    $("#add-edit-customer-popup").addClass("show");
    }

    $("#close-add-edit-customer-popup").click(
    function()
    {
      $('#add-edit-customer-form')[0].reset();
      CloseAddEditcustomerPopup();
    }
    );
      
    function CloseAddEditcustomerPopup() {
    document.body.classList.remove("no-scroll");
    $("#add-edit-customer-popup").removeClass("show");
    }

    // edit customer popup
    function OpenEditcustomerPopup(name, address, contact, customerID) {
    document.body.classList.add("no-scroll");
    $("#add-edit-customer-popup-header-title").text("Edit customer");
    $("#customer-name").val(name);
    $("#customer-orderbooker").hide();
    $("#customer-orderbooker-label").hide();
    $("#customer-address").val(address);
    $("#customer-contact").val(contact);
    $('#add-edit-customer-form').data('id', customerID);
    $("#add-edit-customer-popup").addClass("show");
    }

    // delete customer popup
    function OpenDeletecustomerPopup(description, customerID) {
    document.body.classList.add("no-scroll");
    $("#delete-customer-popup-description").text(description);
    $('#delete-customer-ok-popup-button').data('id', customerID);
    $("#delete-customer-popup").addClass("show");
    }

    $("#close-delete-customer-popup").click(
    function()
    {
      CloseDeletecustomerPopup();
    }
    );

    $("#delete-customer-cancel-popup-button").click(
    function()
    {
      CloseDeletecustomerPopup();
    }
    );
      
    function CloseDeletecustomerPopup() {
    document.body.classList.remove("no-scroll");
    $("#delete-customer-popup").removeClass("show");
    }

    $('#add-customer-button').click(
    function()
    {
      OpenAddEditcustomerPopup("Add customer");
    }
    );

    $('#add-edit-customer-form').submit(function(event)
    {
    event.preventDefault();
    let customerName = $("#customer-name").val().trim();
    let customerorderbooker = $("#orderbookerSearchInput").data('id');
    let customerAddress = $("#customer-address").val().trim();
    let customerContact = $("#customer-contact").val().trim();
    const customerData = {
      name: customerName,
      orderbooker: customerorderbooker,
      address: customerAddress,
      contact: customerContact
    };

    const customerDocId = $('#add-edit-customer-form').data('id');

    $('#add-edit-customer-form')[0].reset();
    CloseAddEditcustomerPopup();

    if(customerDocId === undefined)
    {
      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Customers")
      .add(customerData)
      .then((docRef) => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });
    }
    else
    {
      const customerData = {
        name: customerName,
        address: customerAddress,
        contact: customerContact
      };
      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Customers")
      .doc(customerDocId)
      .update(customerData)
      .then(() => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });

      $('#add-edit-customer-form').data('id', '');
      $("#orderbookerSearchInput").data('id', '');
    }
    });
    const customersRef = firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Customers");

    customersRef.onSnapshot((snapshot) => {
    $('#customers-list').empty();

    $('#customers-count').text(`${snapshot.size}`);

    if (snapshot.empty) {
      $('#customers-list').append('<p style="position:absolute;width:100%;height:calc(100% - 145px);display: flex;align-items: center;justify-content: center;text-align:center;">No customers found.</p>');
      return;
    }

    snapshot.forEach((doc) => {
      const customer = doc.data();
      var orderbookerName;
      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Orderbookers")
      .doc(customer.orderbooker)
      .get()
      .then((odoc) => {
        if (odoc.exists) {
          const orderbookerData = odoc.data();
          orderbookerName = orderbookerData.name;

          const html = `
          <div class="customer-card">
            <h3>${customer.name}</h3>
            <p><img src="../assets/icons/Sidebar_Orderbookers.svg">${orderbookerName}</p>
            <p><img src="../assets/icons/location.svg">${customer.address}</p>
            <p><img src="../assets/icons/contact.svg">${customer.contact}</p>
            <div class="customer-card-buttons">
              <button class="edit-customer-from-card" data-id="${doc.id}"><img src="../assets/icons/edit.svg"></button>
              <button class="delete-customer-from-card" data-id="${doc.id}"><img src="../assets/icons/remove.svg"></button>
            </div>
          </div>
          `;
          $('#customers-list').append(html);
        }
      });
    });
    });

    $(document).on('click', '.delete-customer-from-card', function() {
    const docId = $(this).data('id');
    OpenDeletecustomerPopup("Are you sure you want to delete this customer?", docId);
    });

    $(document).on('click', '.edit-customer-from-card', function() {
    const customerDocId = $(this).data('id');
    firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Customers")
    .doc(customerDocId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const customerData = doc.data();
        var name = customerData.name;
        var address = customerData.address;
        var contact = customerData.contact;
        OpenEditcustomerPopup(name, address, contact, customerDocId);
      }
    });
    });

    $('#delete-customer-ok-popup-button').click(
    function()
    {
      const customerDocId = $(this).data('id');
      
      CloseDeletecustomerPopup();

      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Customers")
      .doc(customerDocId)
      .delete()
      .then(() => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });
    }
    );



    // purchases section
    let purchasescompanies = [];

  // Fetch companies once
  firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Companies")
    .onSnapshot((snapshot) => {
      purchasescompanies = []; // reset
      snapshot.forEach((doc) => {
        purchasescompanies.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      renderPurchasesProductDropdown(purchasescompanies); // initial render
    });

  // Render filtered list
  function renderPurchasesProductDropdown(list) {

    const $dropdown = $('#purchasecompanyDropdown');
    $dropdown.empty();
    if (list.length === 0) {
      $dropdown.append('<li>No results found</li>');
    } else {
      list.forEach((company) => {
        $dropdown.append(`<li data-id="${company.id}">${company.name}</li>`);
      });
    }
    $dropdown.show();
  }

  // Filter on input
  $('#purchasecompanySearchInput').on('input', function () {
    const search = $(this).val().toLowerCase();
    const filtered = purchasescompanies.filter(c => c.name.toLowerCase().includes(search));
    renderPurchasesProductDropdown(filtered);
  });

  // Show dropdown on focus (even with no input)
  $('#purchasecompanySearchInput').on('focus', function () {
    renderPurchasesProductDropdown(purchasescompanies);
  });

  // Handle selection
  $(document).on('click', '#purchasecompanyDropdown li', function () {
    const name = $(this).text();
    const id = $(this).data('id');
    $('#purchasecompanySearchInput').val(name);
    $("#purchasecompanySearchInput").data('id', id);
    $('#purchasecompanyDropdown').hide();

    const productsRef = firebase.firestore()
      .collection('Users')
      .doc(userEmail)
      .collection('Products');

    productsRef
      .where('company', '==', id)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          return;
        }

        querySnapshot.forEach((doc) => {
          const product = doc.data();
          firebase.firestore()
          .collection("Users")
          .doc(userEmail)
          .collection("Companies")
          .doc(product.company)
          .get()
          .then((pdoc) => {
            if (pdoc.exists) {
              const companyData = pdoc.data();
              companyName = companyData.name;
              const html2 = `
              <div data-id="${doc.id}" class="product-card">
                <h3>${product.name}</h3>
                <p><img src="../assets/icons/Sidebar_Companies.svg">${companyName}</p>
                <p><img src="../assets/icons/price.svg">${product.perboxprice}</p>
                <label for="purchase-product-box">Boxes</label>
                <input id="purchase-product-box" data-id="${product.perboxprice}" class="purchases-product-boxes" type="number" placeholder="Enter boxes ..."/>
                <p>Total Price  Rs.<span id="total-product-price">0</span></p>
              </div>
              `;
              $('#purchases-products-list').append(html2);
            }
          })
        });
      })
  });

  // Hide dropdown if focus leaves and no valid selection
  $(document).on('click', function (e) {
    const target = $(e.target);
    if (!target.closest('.purchase-company-search-wrapper').length) {
      const input = $('#purchasecompanySearchInput');
      const val = input.val();
      const matched = companies.find(c => c.name === val);
      if (!matched) {
        input.val('').removeAttr('data-id');
      }
      $('#purchasecompanyDropdown').hide();
    }
  });

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  $('#purchase-date-selector').val(formattedDate);
  $('#sale-date-selector').val(formattedDate);

  $('#save-purchase-button').click(
    function()
    {
      let totalSum = 0;
      const productData = [];

      $('#purchases-products-list .product-card').each(function () {
        const inputVal = $(this).find('input').val();
        const quantity = parseFloat(inputVal);

        if (!isNaN(quantity) && quantity > 0) {
          const productId = $(this).data('id');
          const totalPriceText = $(this).find('p span').text();
          const totalPrice = parseFloat(totalPriceText);

          if (!isNaN(totalPrice)) {
            totalSum += totalPrice;
            productData.push({
              id: productId,
              price: totalPrice,
              boxes: quantity,
            });
          }
        }
      });

      // Make sure at least one product is valid
      if (productData.length === 0) {
        alert("No products with valid values to save.");
        return;
      }

      const db = firebase.firestore();

      // Create a new purchase doc
      db.collection("Users")
        .doc(userEmail)
        .collection("Purchases")
        .add({
          companyId: $("#purchasecompanySearchInput").data('id'),
          totalPrice: totalSum,
          purchaseAt: $('#purchase-date-selector').val(),
        })
        .then((purchaseDocRef) => {
          const batch = db.batch();

          productData.forEach((product) => {
            const productRef = purchaseDocRef.collection("Products").doc(product.id);
            batch.set(productRef, {
              totalPrice: product.price,
              boxes: product.boxes,
            });
          });

          return batch.commit();
        })
        .catch((error) => {
          alert("Error saving purchase:", error);
        });
        $('#purchases-products-list .product-card').each(function () {
          $(this).find('input').val('');
          $(this).find('p span').text('0');
        });
    }
  );

  // sales section
  let salesorderbooker = [];

  // Fetch companies once
  firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Orderbookers")
    .onSnapshot((snapshot) => {
      salesorderbooker = []; // reset
      snapshot.forEach((doc) => {
        salesorderbooker.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      renderSaleOrderbookerDropdown(salesorderbooker); // initial render
    });

  // Render filtered list
  function renderSaleOrderbookerDropdown(list) {
    const $dropdown = $('#saleorderbookerDropdown');
    $dropdown.empty();
  
    if (list.length === 0) {
      $dropdown.append('<li>No results found</li>');
    } else {
      list.forEach((company) => {
        $dropdown.append(`<li data-id="${company.id}">${company.name}</li>`);
      });
    }
    $dropdown.show();
  }  

  // Filter on input
  $('#saleorderbookerSearchInput').on('input', function () {
    const search = $(this).val().toLowerCase();
    const filtered = salesorderbooker.filter(c => c.name.toLowerCase().includes(search));
    renderSaleOrderbookerDropdown(filtered);
  });

  // Show dropdown on focus (even with no input)
  $('#saleorderbookerSearchInput').on('focus', function () {
    renderSaleOrderbookerDropdown(salesorderbooker);
  });

  // Handle selection
  $(document).on('click', '#saleorderbookerDropdown li', function () {
    const name = $(this).text();
    const id = $(this).data('id');
    $('#saleorderbookerSearchInput').val(name);
    $("#saleorderbookerSearchInput").data('id', id);
    $('#saleorderbookerDropdown').hide();
    $('#salecustomerSearchInput').val('');
    $('#salecustomerSearchInput').removeAttr('data-id');
    SetCustomerDropDown(id);
  });

  // Hide dropdown if focus leaves and no valid selection
  $(document).on('click', function (e) {
    const target = $(e.target);
    if (!target.closest('.sale-orderbooker-search-wrapper').length) {
      const input = $('#saleorderbookerSearchInput');
      const val = input.val();
      const matched = salesorderbooker.find(c => c.name === val);
      if (!matched) {
        input.val('').removeAttr('data-id');
      }
      $('#saleorderbookerDropdown').hide();
    }
  });

  function SetCustomerDropDown(selectedsaleorderbooker)
  {
    let salecustomers = [];

    // Fetch orderbookers once
    firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Customers")
      .where('orderbooker', '==', selectedsaleorderbooker)
      .onSnapshot((snapshot) => {
        salecustomers = []; // reset
        snapshot.forEach((doc) => {
          salecustomers.push({
            id: doc.id,
            name: doc.data().name
          });
        });
        renderSaleCustomerDropdown(salecustomers); // initial render
        $('#salecustomerDropdown').hide();

      });

    // Render filtered list
    function renderSaleCustomerDropdown(list) {
      const $dropdown = $('#salecustomerDropdown');
      $dropdown.empty();
      if (list.length === 0) {
        $dropdown.append('<li>No results found</li>');
      } else {
        list.forEach((customer) => {
          $dropdown.append(`<li data-id="${customer.id}">${customer.name}</li>`);
        });
      }
      $dropdown.show();
    }

    // Filter on input
    $('#salecustomerSearchInput').on('input', function () {
      const search = $(this).val().toLowerCase();
      const filtered = salecustomers.filter(c => c.name.toLowerCase().includes(search));
      renderSaleCustomerDropdown(filtered);
    });

    // Show dropdown on focus (even with no input)
    $('#salecustomerSearchInput').on('focus', function () {
      renderSaleCustomerDropdown(salecustomers);
    });

    // Handle selection
    $(document).on('click', '#salecustomerDropdown li', function () {
      const name = $(this).text();
      const id = $(this).data('id');
      $('#salecustomerSearchInput').val(name);
      $("#salecustomerSearchInput").data('id', id);
      $('#salecustomerDropdown').hide();
    });

    // Hide dropdown if focus leaves and no valid selection
    $(document).on('click', function (e) {
      const target = $(e.target);
      if (!target.closest('.sale-customer-search-wrapper').length) {
        const input = $('#salecustomerSearchInput');
        const val = input.val();
        const matched = salecustomers.find(c => c.name === val);
        if (!matched) {
          input.val('').removeAttr('data-id');
        }
        $('#salecustomerDropdown').hide();
      }
    });
  }

  $('#save-sale-button').click(
    function()
    {
      let totalSum = 0;
      const productData = [];

      $('#sales-products-list .product-card').each(function () {
        const inputVal = $(this).find('input').val();
        const quantity = parseFloat(inputVal);

        if (!isNaN(quantity) && quantity > 0) {
          const productId = $(this).data('id');
          const totalPriceText = $(this).find('p span').text();
          const totalPrice = parseFloat(totalPriceText);

          if (!isNaN(totalPrice)) {
            totalSum += totalPrice;
            productData.push({
              id: productId,
              price: totalPrice,
              boxes: quantity,
            });
          }
        }
      });

      // Make sure at least one product is valid
      if (productData.length === 0) {
        alert("No products with valid values to save.");
        return;
      }

      const db = firebase.firestore();

      // Create a new purchase doc
      db.collection("Users")
        .doc(userEmail)
        .collection("Sales")
        .add({
          customerId: $("#salecustomerSearchInput").data('id'),
          totalPrice: totalSum,
          saleAt: $('#sale-date-selector').val(),
        })
        .then((purchaseDocRef) => {
          const batch = db.batch();

          productData.forEach((product) => {
            const productRef = purchaseDocRef.collection("Products").doc(product.id);
            batch.set(productRef, {
              totalPrice: product.price,
              boxes: product.boxes,
            });
          });

          return batch.commit();
        })
        .catch((error) => {
          alert("Error saving purchase:", error);
        });
        $('#sales-products-list .product-card').each(function () {
          $(this).find('input').val('');
          $(this).find('p span').text('0');
        });
        $('#salecustomerSearchInput').val('');
        $('#salecustomerSearchInput').removeAttr('data-id');
    }
  );

  const purchasesRef = firebase.firestore()
  .collection("Users")
  .doc(userEmail)
  .collection("Purchases");

  purchasesRef.onSnapshot((snapshot) => {
    $('#purchases-list').empty();

    $('#purchases-count').text(`${snapshot.size}`);

    if (snapshot.empty) {
      $('#purchases-list').append('<p style="position:absolute;width:100%;height:calc(100% - 145px);display: flex;align-items: center;justify-content: center;text-align:center;">No purchases found.</p>');
      return;
    }

    snapshot.forEach((doc) => {
      const purchase = doc.data();
      firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Companies")
    .doc(purchase.companyId)
    .get()
    .then((cdoc) => {
      const company = cdoc.data();
      const html = `
        <div class="product-card">
          <h3>${purchase.purchaseAt}</h3>
          <p><img src="../assets/icons/Sidebar_Companies.svg">${company.name}</p>
          <p><img src="../assets/icons/price.svg">${purchase.totalPrice}</p>
          <div class="product-card-buttons">
            <button class="view-purchase-from-card" data-id="${doc.id}"><img src="../assets/icons/showrecord.svg"></button>
            <button class="delete-purchase-from-card" data-id="${doc.id}"><img src="../assets/icons/remove.svg"></button>
          </div>
        </div>
      `;
      $('#purchases-list').append(html);
    });
    });
  });

  const salesRef = firebase.firestore()
  .collection("Users")
  .doc(userEmail)
  .collection("Sales");

  salesRef.onSnapshot((snapshot) => {
    $('#sales-list').empty();

    $('#sales-count').text(`${snapshot.size}`);

    if (snapshot.empty) {
      $('#sales-list').append('<p style="position:absolute;width:100%;height:calc(100% - 145px);display: flex;align-items: center;justify-content: center;text-align:center;">No sales found.</p>');
      return;
    }

    snapshot.forEach((doc) => {
      const sale = doc.data();
      firebase.firestore()
    .collection("Users")
    .doc(userEmail)
    .collection("Customers")
    .doc(sale.customerId)
    .get()
    .then((cdoc) => {
      const customer = cdoc.data();
      const html = `
        <div class="product-card">
          <h3>${sale.saleAt}</h3>
          <p><img src="../assets/icons/Sidebar_Customers.svg">${customer.name}</p>
          <p><img src="../assets/icons/price.svg">${sale.totalPrice}</p>
          <div class="product-card-buttons">
            <button class="view-sale-from-card" data-id="${doc.id}"><img src="../assets/icons/showrecord.svg"></button>
            <button class="delete-sale-from-card" data-id="${doc.id}"><img src="../assets/icons/remove.svg"></button>
          </div>
        </div>
      `;
      $('#sales-list').append(html);
    });
    });
  });

  // delete purchase popup
  function OpenDeletepurchasePopup(description, purchaseID) {
    document.body.classList.add("no-scroll");
    $("#delete-purchase-popup-description").text(description);
    $('#delete-purchase-ok-popup-button').data('id', purchaseID);
    $("#delete-purchase-popup").addClass("show");
  }

  $("#close-delete-purchase-popup").click(
    function()
    {
      CloseDeletepurchasePopup();
    }
  );

  $("#delete-purchase-cancel-popup-button").click(
    function()
    {
      CloseDeletepurchasePopup();
    }
  );
      
  function CloseDeletepurchasePopup() {
    document.body.classList.remove("no-scroll");
    $("#delete-purchase-popup").removeClass("show");
  }

  // delete sale popup
  function OpenDeletesalePopup(description, saleID) {
    document.body.classList.add("no-scroll");
    $("#delete-sale-popup-description").text(description);
    $('#delete-sale-ok-popup-button').data('id', saleID);
    $("#delete-sale-popup").addClass("show");
  }

  $("#close-delete-sale-popup").click(
    function()
    {
      CloseDeletesalePopup();
    }
  );

  $("#delete-sale-cancel-popup-button").click(
    function()
    {
      CloseDeletesalePopup();
    }
  );
      
  function CloseDeletesalePopup() {
    document.body.classList.remove("no-scroll");
    $("#delete-sale-popup").removeClass("show");
  }

  $(document).on('click', '.delete-purchase-from-card', function() {
    const docId = $(this).data('id');
    OpenDeletepurchasePopup("Are you sure you want to delete this purchase?", docId);
  });

  $(document).on('click', '.delete-sale-from-card', function() {
    const docId = $(this).data('id');
    OpenDeletesalePopup("Are you sure you want to delete this sale?", docId);
  });

  $('#delete-purchase-ok-popup-button').click(
    function()
    {
      const purchaseDocId = $(this).data('id');
      
      CloseDeletepurchasePopup();

      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Purchases")
      .doc(purchaseDocId)
      .delete()
      .then(() => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });
    }
  );

  $('#delete-sale-ok-popup-button').click(
    function()
    {
      const saleDocId = $(this).data('id');
      
      CloseDeletesalePopup();

      firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Sales")
      .doc(saleDocId)
      .delete()
      .then(() => {
      })
      .catch((error) => {
        OpenPopup(
          "../assets/icons/failed.svg",
          "Error",
          "Something went wrong!, please try again later."
        );
      });
    }
  );

  // view purchase products popup
  function OpenViewpurchasePopup() {
    document.body.classList.add("no-scroll");
    $("#view-purchase-popup").addClass("show");
  }

  $("#close-view-purchase-popup").click(
    function()
    {
      CloseViewpurchasePopup()
    }
  );
      
  function CloseViewpurchasePopup() {
    document.body.classList.remove("no-scroll");
    $("#view-purchase-popup").removeClass("show");
  }

  $(document).on('click', '.view-purchase-from-card', function() {
    const docId = $(this).data('id');
    $('#show-purchase-products').empty();

    const productsRef = firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Purchases").doc(docId).collection("Products");

      productsRef.onSnapshot((snapshot) => {

        snapshot.forEach((ppdoc) => {
          const ppproduct = ppdoc.data();
          firebase.firestore()
          .collection("Users")
          .doc(userEmail)
          .collection("Products")
          .doc(ppdoc.id)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const product = doc.data();
              firebase.firestore()
                .collection("Users")
                .doc(userEmail)
                .collection("Companies")
                .doc(product.company)
                .get()
                .then((pdoc) => {
                  if (pdoc.exists) {
                    const companyData = pdoc.data();
                    var companyName = companyData.name;

                    const html = `
                    <div class="product-card">
                      <h3>${product.name}</h3>
                      <p><img src="../assets/icons/Sidebar_Companies.svg">${companyName}</p>
                      <p><img src="../assets/icons/price.svg">${product.perboxprice}</p>
                      <p><img src="../assets/icons/Sidebar_Products.svg">${ppproduct.boxes} Boxes</p>
                      <p><img src="../assets/icons/price.svg">Rs.${ppproduct.totalPrice} Boxes Price</p>
                      <div class="product-card-buttons">
                        <button class="edit-product-from-card" data-id="${doc.id}"><img src="../assets/icons/edit.svg"></button>
                        <button class="delete-product-from-card" data-id="${doc.id}"><img src="../assets/icons/remove.svg"></button>
                      </div>
                    </div>
                    `;
                    $('#show-purchase-products').append(html);
                    OpenViewpurchasePopup();
                  }
                });
            }
          });
        });
      });
  });

  // view sale products popup
  function OpenViewsalePopup() {
    document.body.classList.add("no-scroll");
    $("#view-sale-popup").addClass("show");
  }

  $("#close-view-sale-popup").click(
    function()
    {
      CloseViewsalePopup();
    }
  );
      
  function CloseViewsalePopup() {
    document.body.classList.remove("no-scroll");
    $("#view-sale-popup").removeClass("show");
  }

  $(document).on('click', '.view-sale-from-card', function() {
    const docId = $(this).data('id');
    $('#show-sale-products').empty();

    const productsRef = firebase.firestore()
      .collection("Users")
      .doc(userEmail)
      .collection("Sales").doc(docId).collection("Products");

      productsRef.onSnapshot((snapshot) => {

        snapshot.forEach((ppdoc) => {
          const ppproduct = ppdoc.data();
          firebase.firestore()
          .collection("Users")
          .doc(userEmail)
          .collection("Products")
          .doc(ppdoc.id)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const product = doc.data();
              firebase.firestore()
                .collection("Users")
                .doc(userEmail)
                .collection("Companies")
                .doc(product.company)
                .get()
                .then((pdoc) => {
                  if (pdoc.exists) {
                    const companyData = pdoc.data();
                    var companyName = companyData.name;

                    const html = `
                    <div class="product-card">
                      <h3>${product.name}</h3>
                      <p><img src="../assets/icons/Sidebar_Companies.svg">${companyName}</p>
                      <p><img src="../assets/icons/price.svg">${product.perboxprice}</p>
                      <p><img src="../assets/icons/Sidebar_Products.svg">${ppproduct.boxes} Boxes</p>
                      <p><img src="../assets/icons/price.svg">Rs.${ppproduct.totalPrice} Boxes Price</p>
                      <div class="product-card-buttons">
                        <button class="edit-product-from-card" data-id="${doc.id}"><img src="../assets/icons/edit.svg"></button>
                        <button class="delete-product-from-card" data-id="${doc.id}"><img src="../assets/icons/remove.svg"></button>
                      </div>
                    </div>
                    `;
                    $('#show-sale-products').append(html);
                    OpenViewsalePopup();
                  }
                });
            }
          });
        });
      });
  });

  // change name popup
  $('#change-name-button').click(
    function()
    {
      OpenChangeNamePopup();
    }
  );
  function OpenChangeNamePopup() {
    document.body.classList.add("no-scroll");
    $('#user-name-input').val( $('#userName').text());
    $("#user-name-change-popup").addClass("show");
  }

  $("#close-user-name-change-popup").click(
    function()
    {
      CloseChangeNamePopup();
    }
  );
      
  function CloseChangeNamePopup() {
    document.body.classList.remove("no-scroll");
    $("#user-name-change-popup").removeClass("show");
  }

  $('#user-name-change-form').submit(function(event)
  {
    event.preventDefault();
    let userName = $("#user-name-input").val().trim();
    if(userName != '' && userName != null && userName != undefined)
    {
      const db = firebase.firestore();

      db.collection("Users").doc(userEmail).update({
        name: userName
      })
      $("#userName").text(userName)
    }
    $('#user-name-change-form')[0].reset();
    CloseChangeNamePopup();
  });

});
