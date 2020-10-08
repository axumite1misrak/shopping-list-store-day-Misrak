const store = {
  items: [
    { id: cuid(), name: "apples", checked: false },
    { id: cuid(), name: "oranges", checked: false },
    { id: cuid(), name: "milk", checked: true },
    { id: cuid(), name: "bread", checked: false },
  ],
  hideCheckedItems: false,
};

const generateItemElement = function (item) {
  let itemTitle = `<span class='shopping-item shopping-item__checked'>${item.name}</span>`;
  if (!item.checked) {
    itemTitle = `
     <span class='shopping-item'>${item.name}</span>
    `;
  }

  return `
    <li class='js-item-element' data-item-id='${item.id}'>
      ${itemTitle}
     <div class="js-shopping-item-edit" id='input-container-${item.id}'> </div>
     
     
      <div class='shopping-item-controls'>
        <button class='shopping-item-toggle js-item-toggle'>
          <span class='button-label'>check</span>
        </button>
        <button class='shopping-item-delete js-item-delete'>
          <span class='button-label'>delete</span>
        </button>
        
        <button class='shopping-item-edit js-item-edit' id='button-${item.id}'>
          <span class='button-label'>edit</span>
        </button>
      </div>
    </li>`;
};

const generateShoppingItemsString = function (shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join("");
};

/** When Edit Button Clicked /Hide Edit Button and make a Submit buston visible/ YOu will make a input filed visible with the item.title */
/** Then After Edit when submit button clicked make a function hundler to Edit the exact itme Use FILTER with the Itme id  */
/**
 * Render the shopping list in the DOM
 */
const render = function () {
  // Set up a copy of the store's items in a local
  // variable 'items' that we will reassign to a new
  // version if any filtering of the list occurs.
  let items = [...store.items];
  // If the `hideCheckedItems` property is true,
  // then we want to reassign filteredItems to a
  // version where ONLY items with a "checked"
  // property of false are included.
  if (store.hideCheckedItems) {
    items = items.filter((item) => !item.checked);
  }

  /**
   * At this point, all filtering work has been
   * done (or not done, if that's the current settings),
   * so we send our 'items' into our HTML generation function
   */
  const shoppingListItemsString = generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $(".js-shopping-list").html(shoppingListItemsString);
};

const addItemToShoppingList = function (itemName) {
  store.items.push({ id: cuid(), name: itemName, checked: false });
};

const handleNewItemSubmit = function () {
  $("#js-shopping-list-form").submit(function (event) {
    event.preventDefault();
    const newItemName = $(".js-shopping-list-entry").val();
    $(".js-shopping-list-entry").val("");
    addItemToShoppingList(newItemName);
    render();
  });
};

const toggleCheckedForListItem = function (id) {
  const foundItem = store.items.find((item) => item.id === id);
  foundItem.checked = !foundItem.checked;
};

const handleItemCheckClicked = function () {
  $(".js-shopping-list").on("click", ".js-item-toggle", (event) => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    render();
  });
};

const getItemIdFromElement = function (item) {
  return $(item).closest(".js-item-element").data("item-id");
};

/**
 * Responsible for deleting a list item.
 * @param {string} id
 */
const deleteListItem = function (id) {
  // As with 'addItemToShoppingLIst', this
  // function also has the side effect of
  // mutating the global store value.
  //
  // First we find the index of the item with
  // the specified id using the native
  // Array.prototype.findIndex() method.
  const index = store.items.findIndex((item) => item.id === id);
  // Then we call `.splice` at the index of
  // the list item we want to remove, with
  // a removeCount of 1.
  store.items.splice(index, 1);
};

const handleDeleteItemClicked = function () {
  // Like in `handleItemCheckClicked`,
  // we use event delegation.
  $(".js-shopping-list").on("click", ".js-item-delete", (event) => {
    // Get the index of the item in store.items.
    const id = getItemIdFromElement(event.currentTarget);
    // Delete the item.
    deleteListItem(id);
    // Render the updated shopping list.
    render();
  });
};
let onEdit = {
  status: false,
};
/* edit eventlit*/
const handleEdit = function () {
  $(".js-shopping-list").on("click", ".js-item-edit", (event) => {
    /** Get the Eelment ID    */
    const id = getItemIdFromElement(event.currentTarget);
    /** GEt the element by id and make the element display block */

    const itemname = store.items.filter((item) => {
      return item.id === id;
    });
    var element = document.createElement("input");
    element.setAttribute("class", "js-input-item-edit");
    element.setAttribute("value", `${itemname[0].name}`);
    element.setAttribute("id", `"input-${id}"`);
    document.getElementById(`input-container-${id}`).appendChild(element);
    /** Disable Edit Button or hide  */
    const button = document.getElementById(`button-${id}`);
    button.disabled = true;

    document
      .getElementById(`"input-${id}"`)
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          /** 1. get the value from the input field 2. Using the item name change the name */

          const newname = document.getElementById(`"input-${id}"`).value;

          const updateIndex = store.items.map((item) => item.id).indexOf(id);
          const updateItem = {
            ...store.items[updateIndex],
            name: newname,
          };

          store.items.splice(updateIndex, 1, updateItem);
          render();
        }
      });
  });
};

/**
 * Toggles the store.hideCheckedItems property
 */
const toggleCheckedItemsFilter = function () {
  store.hideCheckedItems = !store.hideCheckedItems;
};

/**
 * Places an event listener on the checkbox
 * for hiding completed items.
 */
const handleToggleFilterClick = function () {
  $(".js-filter-checked").click(() => {
    toggleCheckedItemsFilter();
    render();
  });
};

/**
 * This function will be our callback when the
 * page loads. It is responsible for initially
 * rendering the shopping list, then calling
 * our individual functions that handle new
 * item submission and user clicks on the
 * "check" and "delete" buttons for individual
 * shopping list items.
 */

const handleShoppingList = function () {};

// when the page loads, call `handleShoppingList`
$(function () {
  render();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleFilterClick();
  handleEdit();
});
