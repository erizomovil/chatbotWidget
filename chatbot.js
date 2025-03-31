(function() {
  // Crear el HTML del widget de manera dinámica
  const chatWidget = document.createElement('div');
  chatWidget.id = 'chat-widget';
  chatWidget.innerHTML = `
      <!-- Ícono de mensaje -->
      <div id="chat-icon" title="Abrir chat">
          <div id="chat-icon-inner">💬</div>
      </div>
      
      <!-- Contenedor del chat (inicialmente oculto) -->
      <div id="chat-box" style="display: none;">
          <div id="chat-header">
              <button id="close-chat">✖</button>
              <button id="reset-chat">↻</button>
          </div>
          <div id="chat-log"></div>
          <div id="button-container"></div>
          <input type="text" id="user-input" placeholder="Escribe un mensaje..." disabled />
          <button id="send-message" disabled>Enviar</button>
      </div>
  `;

  // Estilos para el widget
  const style = document.createElement('style');
  style.innerHTML = `
      /* Estilos generales para el widget */
      #chat-widget {
          position: fixed;
          bottom: 10px;
          right: 10px;
          z-index: 9999;
      }

      /* Estilo del ícono de mensaje */
      #chat-icon {
          cursor: pointer;
          background-color: #701317;
          border-radius: 50%;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
      }

      /* Estilos del chat */
      #chat-box {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 300px;
          max-height: 400px;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          padding: 10px;
          display: flex;
          flex-direction: column;
          font-family: sans-serif;
          color: black;
      }

      #chat-header {
          display: flex;
          justify-content: space-between;
          background-color: #701317;
          padding-bottom: 10px;
      }

      #chat-header button {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: white;
      }

      /* Área de conversación */
      #chat-log {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 10px;
          height: 300px;
          display: flex;
          flex-direction: column;
      }

      #input-container {
          display: flex;
          gap: 5px;
      }

      /* Campo de entrada corregido */
      #user-input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: white;
          color: black;
      }

      /* Estilos de los botones */
      .button-option {
          padding: 10px;
          background-color: #e0e0e0;
          color: black;
          border: none;
          border-radius: 5px;
          margin: 5px;
          cursor: pointer;
      }

      /* Hover de los botones */
      .button-option:hover {
          background-color:rgb(203, 202, 202);
      }

      /* Estilos del botón de enviar */
      #send-message {
          padding: 10px;
          background-color: #701317;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
      }

      #send-message:hover {
          background-color: #50100E;
      }

      /* Estilos de los mensajes */
      .message {
          padding: 8px 12px;
          margin: 4px 0;
          border-radius: 8px;
          font-family: sans-serif;
          max-width: 80%;
          word-wrap: break-word;
          display: block;
      }

      /* Mensajes del usuario alineados a la derecha */
      .user-message {
          background-color: #701317;
          text-align: right;
          align-self: flex-end;
          color: white;
      }

      /* Mensajes del servidor alineados a la izquierda con color grisáceo */
      .bot-message {
          background-color: #e0e0e0;
          text-align: left;
          align-self: flex-start;
      }

      /* Estilo del mensaje de espera */
      .loading-message {
          background-color: #e0e0e0;
          color: gray;
          font-style: italic;
          text-align: center;
          padding: 10px;
          border-radius: 8px;
          align-self: flex-start;
      }
  `;
  document.head.appendChild(style);
  document.body.appendChild(chatWidget);

  // Obtener los elementos del widget
  const chatBox = document.getElementById('chat-box');
  const chatIcon = document.getElementById('chat-icon');
  const chatLog = document.getElementById('chat-log');
  const closeChat = document.getElementById('close-chat');
  const resetChat = document.getElementById('reset-chat');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-message');
  const buttonContainer = document.getElementById('button-container');

  // Abrir y cerrar el chat al hacer clic en el ícono
  chatIcon.addEventListener('click', function() {
      chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
  });

  closeChat.addEventListener('click', () => {
    chatBox.style.display = 'none';
  });

  resetChat.addEventListener('click', () => {
    chatLog.innerHTML = '';
  });

  // Enviar mensaje al hacer clic en el botón de enviar
  sendButton.addEventListener('click', function() {
      sendMessage();
  });

  // Enviar mensaje al presionar "Enter"
  userInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          sendMessage();
      }
  });

  // Función para mostrar los mensajes en el chat
  function appendMessage(message, senderClass) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', senderClass);
      messageDiv.textContent = message;
      chatLog.appendChild(messageDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
  }

  // Mostrar mensajes iniciales del bot
  window.onload = function() {
      appendMessage('Hello! I can help you with different things, to continue select one of the options.', 'bot-message');
      showButtons();
  };

  // Mostrar los botones
  function showButtons() {
      const options = ['Research Team', 'Net working', 'Latest News', 'About the page', 'Information', 'Contacts'];

      options.forEach(option => {
          const button = document.createElement('button');
          button.textContent = option;
          button.classList.add('button-option');
          button.addEventListener('click', function() {
              handleButtonClick(option);
          });
          buttonContainer.appendChild(button);
      });
  }

  // Función cuando el usuario selecciona un botón
  function handleButtonClick(option) {
      appendMessage(option, 'user-message');
      if (option === 'Information') {
        buttonContainer.innerHTML = ''; 
        showPdfButtons();
    } else {
        sendButtonSelectionToServer(option);
        disableButtons();
    }
  }

  // Función para mostrar los botones de los PDFs
  function showPdfButtons() {
      const pdfOptions = ['Research Team', 'Net working', 'Latest News', 'About the page'];
      
      buttonContainer.style.display = 'block'; // Asegurarse de que el contenedor de botones esté visible
      pdfOptions.forEach(pdf => {
          const button = document.createElement('button');
          button.textContent = pdf;
          button.classList.add('button-option');
          button.addEventListener('click', function() {
              handlePdfButtonClick(pdf); // Enviar PDF al backend para interacción
          });
          buttonContainer.appendChild(button);
      });
  }

  // Función cuando el usuario selecciona uno de los PDFs
  function handlePdfButtonClick(pdf) {
      appendMessage(pdf, 'user-message');
      sendButtonSelectionToServer(pdf);
      disableButtons(); 
      setInputDisabled(true);
  }

  // Desactivar los botones después de hacer una selección
  function disableButtons() {
      const buttons = document.querySelectorAll('.button-option');
      buttons.forEach(button => {
          button.disabled = true;
      });
      // Hacer que el campo de texto y el botón de enviar sean habilitados
      userInput.disabled = false;
      sendButton.disabled = false;
      userInput.focus();
      buttonContainer.style.display = 'none'; // Ocultar los botones
  }

  // Función para enviar el mensaje del usuario
  function sendMessage() {
      const message = userInput.value.trim();
      if (message !== '') {
          appendMessage(message, 'user-message');
          sendMessageToServer(message);
          userInput.value = '';
          setInputDisabled(true);
      }
  }

  // Enviar mensaje al servidor
  function sendMessageToServer(message) {
      const loadingMessage = document.createElement('div');
      loadingMessage.classList.add('loading-message');
      loadingMessage.textContent = '...';
      chatLog.appendChild(loadingMessage);
      chatLog.scrollTop = chatLog.scrollHeight;
      fetch('https://chatbot-server-navy.vercel.app/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: message })
      })
      .then(response => response.json())
      .then(data => {
          appendMessage(data.response || 'Could not get a response from the server.', 'bot-message');
      })
      .catch(error => {
          console.error('Error:', error);
          appendMessage('There was an error processing the request.', 'bot-message');
      })
      .finally(() => {
          loadingMessage.remove();  // Eliminar el mensaje de carga una vez completado
          setInputDisabled(false);
      });
  }
  function setInputDisabled(disabled) {
    userInput.disabled = disabled;
    sendButton.disabled = disabled;
  }
  function sendButtonSelectionToServer(option) {
    const loadingMessage = document.createElement('div');
    loadingMessage.classList.add('loading-message');
    loadingMessage.textContent = '...';
    chatLog.appendChild(loadingMessage);
    chatLog.scrollTop = chatLog.scrollHeight;
    fetch('https://chatbot-server-navy.vercel.app/button-action', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ option: option }),
        mode: "cors",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        appendMessage(data.response || 'No response from server.', 'bot-message');
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('There was an error processing the request.', 'bot-message');
    })
    .finally(() => {
        loadingMessage.remove();// Eliminar el mensaje de carga una vez completado
        setInputDisabled(false);
    });
  }
})();
