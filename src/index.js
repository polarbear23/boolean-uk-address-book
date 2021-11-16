const viewSection = document.querySelector(".view-section");
const contactsSection = document.querySelector(".contacts-section");

const state = {
  contacts: [],
  selectedContact: null
};

/* [START] NO NEED TO EDIT */

async function getContacts() {
  const response = await fetch("http://localhost:3000/contacts");
  const data = await response.json();
  state.contacts = data;
  renderContactsList(); 
}
function renderContactsList() {
  const listEl = document.createElement("ul");
  listEl.className = "contacts-list";

  for (let i = 0; i < state.contacts.length; i++) {
    const contact = state.contacts[i];
    const listItemEl = renderContactListItem(contact);

    listEl.append(listItemEl);
  }

  contactsSection.append(listEl);
}

function renderAddressSection(address) {
  const containerEl = document.createElement("section");

  const headingEl = document.createElement("h2");
  headingEl.innerText = "Address";

  containerEl.append(headingEl);

  const streetText = document.createElement("p");
  streetText.innerText = address.street;

  containerEl.append(streetText);

  const cityText = document.createElement("p");
  cityText.innerText = address.city;

  containerEl.append(cityText);

  const postCodeText = document.createElement("p");
  postCodeText.innerText = address.postCode;

  containerEl.append(postCodeText);

  return containerEl;
}

function renderContactView() {
  const contact = state.selectedContact;
  console.log(contact);
  if (!contact) return;

  viewSection.innerHTML = "";

  const containerEl = document.createElement("article");
  containerEl.className = "center light-shadow address-card";

  const headingEl = document.createElement("h1");

  const fullName = `${contact.firstName} ${contact.lastName}`;
  headingEl.innerText = fullName;

  containerEl.append(headingEl);

  const addressSectionEl = renderAddressSection(contact.address);

  containerEl.append(addressSectionEl);

  viewSection.append(containerEl);
}

/* [END] NO NEED TO EDIT */

function renderContactListItem(contact) {
  const listItemEl = document.createElement("li");

  const headingEl = document.createElement("h3");

  const fullName = `${contact.firstName} ${contact.lastName}`;

  headingEl.innerText = fullName;

  listItemEl.append(headingEl);

  const viewBtn = document.createElement("button");
  viewBtn.className = "button grey";
  viewBtn.innerText = "View";

  viewBtn.addEventListener("click", function () {
    state.selectedContact = contact;

    renderContactView();
  });

  listItemEl.append(viewBtn);

  const editBtn = document.createElement("button");
  editBtn.className = "button blue";
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", function () {
    // [TODO] Write Code
    state.selectedContact = contact;
    renderEditContactForm();
  });

  listItemEl.append(editBtn);

  return listItemEl;
}

function listenNewContactButton() {
  const btn = document.querySelector(".new-contact-btn");

  btn.addEventListener("click", function () {
    // [TODO] Write Code
    state.selectedContact = null;
    renderAddContactForm();
  });
}

// [TODO] Write Code

function renderAddContactForm(){
  const formContainer = document.querySelector(".view-section");
  formContainer.innerHTML = "";
  const form = document.createElement("form");
  form.className = "form-stack light-shadow center contact-form";
  const formTitle = document.createElement("h1");
  formTitle.innerText = "Create Contact";

  form.addEventListener("submit", (e) =>{
    e.preventDefault();
    console.log("hi");
    console.log(state.contacts);
    const inputs = form.querySelectorAll("input");
    const currentDisplayedContacts = document.querySelectorAll("li");
    const contact = {
      "firstName": inputs[0].value,
      "lastName": inputs[1].value,
      "blockContact": inputs[5].checked,
      "addressId": currentDisplayedContacts.length + 1
    }
    const address = {
      "street": inputs[2].value,
      "city": inputs[3].value,
      "postCode": inputs[4].value
    }
    addNewContactFetch(contact, "contacts");
    addNewContactFetch(address, "addresses");
  });
  form.appendChild(formTitle);
  createNameInputs(form);
  createAddressInputs(form);
  createCheckboxActionSections(form);
  formContainer.append(form);
  
}

function renderEditContactForm(){
  const formContainer = document.querySelector(".view-section");
  formContainer.innerHTML = "";
  const form = document.createElement("form");
  form.className = "form-stack light-shadow center contact-form";
  const formTitle = document.createElement("h1");
  formTitle.innerText = "Edit Contact";

  form.addEventListener("submit", (e) =>{
    e.preventDefault();
    const inputs = form.querySelectorAll("input");
    let firstName = inputs[0].value;
    let secondName = inputs[1].value;
    let blockContact = inputs[5].checked;
    let streetName = inputs[2].value;
    let cityName = inputs[3].value;
    let postCode = inputs[4].value;
    if(inputs[0].value.length <= 0){
      firstName = state.selectedContact.firstName;
    }
    if(inputs[1].value.length <= 0){
      secondName = state.selectedContact.secondName;
    }
    if(inputs[2].value.length <= 0){
      streetName = state.selectedContact.street;
    }
    if(inputs[3].value.length <= 0){
      cityName = state.selectedContact.city;
    }
    if(inputs[4].value.length <= 0){
      postCode = state.selectedContact.postCode;
    }
    if(inputs[5].checked === state.selectedContact.blockContact){
      blockContact = state.selectedContact.blockContact;
    }
    const contact = {
      "firstName": firstName,
      "lastName": secondName,
      "blockContact": blockContact,
      "addressId": state.selectedContact.addressId
    }
    const address = {
      "street": streetName,
      "city": cityName,
      "postCode": postCode
    }
    //fetch patch
    updateContactFetch(contact, "contacts", state.selectedContact.id);
    updateContactFetch(address, "addresses", state.selectedContact.addressId);

  });
  form.appendChild(formTitle);
  createNameInputs(form, true);
  createAddressInputs(form, true);
  const checkbox = createCheckboxActionSections(form, true);
  checkbox.checked = state.selectedContact.blockContact;
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete Contact";
  deleteBtn.type = "button";

  deleteBtn.addEventListener("click", ()=>{
    //fetch Delete
    deleteContactFetch(state.selectedContact.id);
  });
  form.appendChild(deleteBtn);
  formContainer.append(form);
  
}

function createNameInputs(form, placeholder = false){
  const firstNameLabel = document.createElement("label");
  firstNameLabel.innerText = "First Name:"
  firstNameLabel.for = "first-name-input";
  const firstNameInput = document.createElement("input");
  firstNameInput.id = "first-name-input";
  firstNameInput.name = "first-name-input";
  firstNameInput.type = "text";
  const lastNameLabel = document.createElement("label");
  lastNameLabel.innerText = "Last Name:"
  lastNameLabel.for = "last-name-input";
  const lastNameInput = document.createElement("input");
  lastNameInput.id = "last-name-input";
  lastNameInput.name = "last-name-input";
  lastNameInput.type = "text";
  if(placeholder === true){
    firstNameInput.placeholder = `${state.selectedContact.firstName}`;
    lastNameInput.placeholder = `${state.selectedContact.lastName}`;
  }
  form.append(firstNameLabel, firstNameInput, lastNameLabel, lastNameInput);
}

function createAddressInputs(form, placeholder = false){
/*
  <label for="street-input">Street:</label>
  <input id="street-input" name="street-input" type="text" />
  <label for="city-input">City:</label>
  <input id="city-input" name="city-input" type="text" />
  <label for="post-code-input">Post Code:</label>
  <input id="post-code-input" name="post-code-input" type="text" />
*/
  const streetLabel = document.createElement("label");
  streetLabel.innerText = "Street:"
  streetLabel.for = "street-input";
  const streetInput = document.createElement("input");
  streetInput.id = "street-input";
  streetInput.name = "street-input";
  streetInput.type = "text";
  const cityLabel = document.createElement("label");
  cityLabel.innerText = "City:"
  cityLabel.for = "city-input";
  const cityInput = document.createElement("input");
  cityInput.id = "city-input";
  cityInput.name = "city-input";
  cityInput.type = "text";
  const postcodeLabel = document.createElement("label");
  postcodeLabel.innerText = "Postcode:"
  postcodeLabel.for = "post-code-input";
  const postcodeInput = document.createElement("input");
  postcodeInput.id = "post-code-input";
  postcodeInput.name = "post-code-input";
  postcodeInput.type = "text";

  if(placeholder === true){
    console.log(state.selectedContact);
    streetInput.placeholder = `${state.selectedContact.address.street}`;
    cityInput.placeholder = `${state.selectedContact.address.city}`;
    postcodeInput.placeholder = `${state.selectedContact.address.postCode}`;
  }

  form.append(streetLabel, streetInput, cityLabel, cityInput, postcodeLabel, postcodeInput);
}

function createCheckboxActionSections(form, placeholder = false){
  /*
  <div class="checkbox-section">
    <input id="block-checkbox" name="block-checkbox" type="checkbox" />
    <label for="block-checkbox">Block</label>
  </div>
  <div class="actions-section">
    <button class="button blue" type="submit">Create</button>
  </div>
  */
  const checkboxSection = document.createElement("div");
  checkboxSection.className = "checkbox-section";
  const checkboxInput = document.createElement("input");
  checkboxInput.id ="block-checkbox";
  checkboxInput.name = "block-checkbox";
  checkboxInput.type = "checkbox";
  const checkboxLabel = document.createElement("label");
  checkboxLabel.for = "block-checkbox";
  checkboxLabel.innerText = "Block";
  const actionsSection = document.createElement("div");
  actionsSection.className = "actions-section";
  const submitBtn = document.createElement("button");
  submitBtn.className = "button blue";
  submitBtn.type = "submit";
  submitBtn.innerText = "Create";

  if(placeholder === true){
    submitBtn.innerText = "Save Changes"
  }
  checkboxSection.append(checkboxInput,checkboxLabel);
  actionsSection.append(submitBtn);
  form.append(checkboxSection, actionsSection);
  return checkboxInput;
}

function addNewContactFetch(content, nameOfDatabase){
  fetch(`http://localhost:3000/${nameOfDatabase}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)  
  })
  .then(()=>{
    if(nameOfDatabase === "contacts"){
      const list = document.querySelector(".contacts-list");
      list.remove();
      getContactsAndUpdateState(state.contacts.length-1); //index of item to display in view section
    }
  })
}
function deleteContactFetch(id){
  fetch(`http://localhost:3000/contacts/${id}`, {
    method: "DELETE"
  })
  .then(()=>{
    fetch(`http://localhost:3000/addresses/${id}`, {
    method: "DELETE"
    })
    const list = document.querySelector(".contacts-list");
    list.remove();
    getContactsAndUpdateState(id-2); //index of item to display in view section

    if(state.contacts.length === 1){
      state.selectedContact = null;
      renderAddContactForm();
    }
    
  })
}

function updateContactFetch(content, nameOfDatabase, id){
  fetch(`http://localhost:3000/${nameOfDatabase}/${id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)  
  })
  .then(()=>{
    if(nameOfDatabase === "contacts"){
      const list = document.querySelector(".contacts-list");
      list.remove();
      getContactsAndUpdateState(state.selectedContact.id-1); //index of item to display in view section
    }
  })
}


async function getContactsAndUpdateState(index){
  if(index <0) {
    index = 0;
  }

  const gettingContacts = await getContacts();
  state.selectedContact = state.contacts[index];
  renderContactView();
}


function main() {
  listenNewContactButton();
  getContacts();
}

main();
