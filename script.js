var ngWords = [];

function loadNgWords() {
  var request = new XMLHttpRequest();
  request.open("GET", "ngWords.json", true);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      ngWords = JSON.parse(request.responseText);
    }
  };
  request.send();
}

window.onload = function() {
  loadNgWords();
};

function containsNgWord(message) {
  var lowerMessage = message.toLowerCase();
  return ngWords.some(function(ngWord) {
    return lowerMessage.includes(ngWord);
  });
}

function createMessageElement(message, imageUrl) {
  var messageElement = document.createElement('li');
  messageElement.classList.add('chat-message');

  if (imageUrl) {
    var imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.classList.add('chat-image');
    messageElement.appendChild(imageElement);
  }

  if (message) {
    var textElement = document.createElement('p');
    textElement.textContent = message;
    messageElement.appendChild(textElement);
  }

  messageElement.id = 'message_' + Date.now();

  messageElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    var dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.dataset.messageId = messageElement.id;
    showDropdownMenu(event);
  });

  return messageElement;
}

function addMessage(message, imageUrl) {
  var chatList = document.getElementById('chatList');

  if (containsNgWord(message)) {
    alert('NGワードが含まれています。');
    return;
  }

  var messageElement = createMessageElement(message, imageUrl);
  chatList.appendChild(messageElement);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  var messageInput = document.getElementById('messageInput');
  var message = messageInput.value.trim();
  var imageUrl = null;

  if (selectedImage) {
    imageUrl = URL.createObjectURL(selectedImage);
    selectedImage = null;
    imageInput.value = '';
  }

  if (message !== '' || imageUrl) {
    addMessage(message, imageUrl);
    messageInput.value = '';
  }
}

function showDropdownMenu(event) {
  event.preventDefault();
  var dropdownMenu = document.getElementById('dropdownMenu');
  dropdownMenu.style.display = 'block';
  dropdownMenu.style.left = event.pageX + 'px';
  dropdownMenu.style.top = event.pageY + 'px';
}

function hideDropdownMenu() {
  var dropdownMenu = document.getElementById('dropdownMenu');
  dropdownMenu.style.display = 'none';
}

function deleteMessage() {
  var dropdownMenu = document.getElementById('dropdownMenu');
  var selectedMessage = dropdownMenu.dataset.messageId;

  if (selectedMessage) {
    var chatList = document.getElementById('chatList');
    var messageToRemove = document.getElementById(selectedMessage);
    chatList.removeChild(messageToRemove);
  }

  hideDropdownMenu();
}

var selectedImage = null;

function handleImageUpload(event) {
  var imageInput = event.target;
  var imageFile = imageInput.files[0];

  if (imageFile) {
    selectedImage = imageFile;
  }
}

window.addEventListener('click', function(event) {
  var dropdownMenu = document.getElementById('dropdownMenu');
  if (event.target !== dropdownMenu && !dropdownMenu.contains(event.target)) {
    hideDropdownMenu();
  }
});
