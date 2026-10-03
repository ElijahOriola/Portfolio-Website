document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'oriolaContactManagerContacts';
  const messagesStorageKey = 'oriolaContactFormMessages';
  const form = document.getElementById('contactManagerForm');
  const formTitle = document.getElementById('formTitle');
  const saveButton = document.getElementById('saveContactButton');
  const cancelButton = document.getElementById('cancelEditButton');
  const status = document.getElementById('managerStatus');
  const contactList = document.getElementById('contactList');
  const searchInput = document.getElementById('contactSearch');
  const count = document.getElementById('contactCount');
  const countLabel = document.getElementById('contactCountLabel');
  const dashboardTotal = document.getElementById('dashboardTotal');
  const dashboardRecentCount = document.getElementById('dashboardRecentCount');
  const dashboardRecentList = document.getElementById('dashboardRecentList');
  const dashboardMessageTotal = document.getElementById('dashboardMessageTotal');
  const messageList = document.getElementById('messageList');
  const messageSearch = document.getElementById('messageSearch');
  const messageStatus = document.getElementById('messageStatus');
  const pageTitle = document.getElementById('adminPageTitle');
  const dashboardView = document.getElementById('dashboardView');
  const contactsView = document.getElementById('contactsView');
  const sidebarTabs = document.querySelectorAll('.sidebar-tab[data-view]');
  const fields = {
    name: document.getElementById('managerName'),
    email: document.getElementById('managerEmail'),
    phone: document.getElementById('managerPhone'),
    company: document.getElementById('managerCompany'),
    notes: document.getElementById('managerNotes')
  };

  let contacts = [];
  let messages = [];
  let editingId = null;
  let editingMessageId = null;
  let storageReady = true;
  let messageStorageReady = true;

  function showStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('error', isError);
  }

  function readContacts() {
    const savedContacts = localStorage.getItem(storageKey);
    if (savedContacts === null) return [];

    const parsedContacts = JSON.parse(savedContacts);
    if (!Array.isArray(parsedContacts)) {
      throw new Error('Saved contacts have an invalid format.');
    }

    const validContacts = parsedContacts.every(contact =>
      contact &&
      typeof contact.id === 'string' &&
      typeof contact.name === 'string' &&
      typeof contact.email === 'string' &&
      typeof contact.phone === 'string' &&
      typeof contact.company === 'string' &&
      typeof contact.notes === 'string' &&
      typeof contact.createdAt === 'string'
    );

    if (!validContacts) {
      throw new Error('Saved contacts contain invalid data.');
    }
    return parsedContacts;
  }

  function readMessages() {
    const savedMessages = localStorage.getItem(messagesStorageKey);
    if (savedMessages === null) return [];

    const parsedMessages = JSON.parse(savedMessages);
    if (!Array.isArray(parsedMessages)) {
      throw new Error('Saved website messages have an invalid format.');
    }

    const validMessages = parsedMessages.every(message =>
      message &&
      typeof message.id === 'string' &&
      typeof message.name === 'string' &&
      typeof message.email === 'string' &&
      typeof message.phone === 'string' &&
      typeof message.service === 'string' &&
      typeof message.timeline === 'string' &&
      typeof message.details === 'string' &&
      typeof message.createdAt === 'string'
    );
    if (!validMessages) {
      throw new Error('Saved website messages contain invalid data.');
    }
    return parsedMessages;
  }

  function showMessageStatus(message, isError = false) {
    messageStatus.textContent = message;
    messageStatus.classList.toggle('error', isError);
  }

  function persistMessages(nextMessages, successMessage) {
    try {
      localStorage.setItem(messagesStorageKey, JSON.stringify(nextMessages));
      messages = nextMessages;
      messageStorageReady = true;
      renderMessages();
      showMessageStatus(successMessage);
      return true;
    } catch (error) {
      showMessageStatus(`Could not save website messages: ${error.message}`, true);
      return false;
    }
  }

  function appendMessageField(container, labelText, value, multiline = false) {
    const field = document.createElement('p');
    field.className = 'message-detail';
    const label = document.createElement('strong');
    label.textContent = `${labelText}: `;
    const content = document.createElement('span');
    content.textContent = value;
    field.append(label, content);
    if (multiline) field.classList.add('message-body');
    container.appendChild(field);
  }

  function createMessageEditor(message) {
    const formElement = document.createElement('form');
    formElement.className = 'message-edit-form';
    formElement.dataset.messageId = message.id;

    [
      ['name', 'Name', 'text'],
      ['email', 'Email', 'email'],
      ['phone', 'Phone', 'tel'],
      ['service', 'Service', 'text'],
      ['timeline', 'Timeline', 'text'],
      ['details', 'Project details', 'textarea']
    ].forEach(([key, labelText, type]) => {
      const label = document.createElement('label');
      label.className = 'message-edit-field';
      if (type === 'textarea') label.classList.add('message-edit-field-wide');
      label.textContent = labelText;
      let control;
      if (type === 'textarea') {
        control = document.createElement('textarea');
        control.rows = 4;
        control.required = true;
      } else {
        control = document.createElement('input');
        control.type = type;
        control.required = key === 'name' || key === 'email';
      }
      control.name = key;
      control.value = message[key];
      label.appendChild(control);
      formElement.appendChild(label);
    });

    const actions = document.createElement('div');
    actions.className = 'message-actions';
    const saveButton = document.createElement('button');
    saveButton.className = 'admin-button admin-button-primary';
    saveButton.type = 'submit';
    saveButton.innerHTML = '<i class="fas fa-floppy-disk" aria-hidden="true"></i> Save changes';
    const cancelButton = document.createElement('button');
    cancelButton.className = 'admin-button admin-button-secondary';
    cancelButton.type = 'button';
    cancelButton.dataset.messageAction = 'cancel';
    cancelButton.dataset.messageId = message.id;
    cancelButton.textContent = 'Cancel';
    actions.append(saveButton, cancelButton);
    formElement.appendChild(actions);
    return formElement;
  }

  function createMessageCard(message) {
    const card = document.createElement('article');
    card.className = 'message-card';

    if (editingMessageId === message.id) {
      card.appendChild(createMessageEditor(message));
      return card;
    }

    const header = document.createElement('div');
    header.className = 'message-card-header';
    const sender = document.createElement('div');
    sender.className = 'message-sender';
    const name = document.createElement('h3');
    name.textContent = message.name;
    const date = document.createElement('time');
    const parsedDate = new Date(message.createdAt);
    date.textContent = Number.isNaN(parsedDate.getTime()) ? 'Date unavailable' : parsedDate.toLocaleString();
    if (!Number.isNaN(parsedDate.getTime())) date.dateTime = parsedDate.toISOString();
    sender.append(name, date);

    const actions = document.createElement('div');
    actions.className = 'contact-card-actions';
    const editButton = document.createElement('button');
    editButton.className = 'contact-action';
    editButton.type = 'button';
    editButton.title = 'Edit message';
    editButton.setAttribute('aria-label', `Edit message from ${message.name}`);
    editButton.dataset.messageAction = 'edit';
    editButton.dataset.messageId = message.id;
    editButton.innerHTML = '<i class="fas fa-pen" aria-hidden="true"></i>';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'contact-action delete';
    deleteButton.type = 'button';
    deleteButton.title = 'Delete message';
    deleteButton.setAttribute('aria-label', `Delete message from ${message.name}`);
    deleteButton.dataset.messageAction = 'delete';
    deleteButton.dataset.messageId = message.id;
    deleteButton.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i>';
    actions.append(editButton, deleteButton);
    header.append(sender, actions);
    card.appendChild(header);

    appendMessageField(card, 'Email', message.email);
    if (message.phone) appendMessageField(card, 'Phone', message.phone);
    if (message.service) appendMessageField(card, 'Service', message.service);
    if (message.timeline) appendMessageField(card, 'Timeline', message.timeline);
    appendMessageField(card, 'Project details', message.details, true);
    return card;
  }

  function renderMessages() {
    const query = messageSearch.value.trim().toLowerCase();
    const filteredMessages = [...messages]
      .filter(message => [
        message.name,
        message.email,
        message.phone,
        message.service,
        message.timeline,
        message.details
      ].some(value => value.toLowerCase().includes(query)))
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));

    dashboardMessageTotal.textContent = String(messages.length);
    messageList.replaceChildren();

    if (!messageStorageReady) {
      const error = document.createElement('p');
      error.className = 'empty-contacts';
      error.textContent = 'Website messages could not be loaded. Check this browser’s storage settings.';
      messageList.appendChild(error);
      return;
    }

    if (filteredMessages.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-contacts';
      const icon = document.createElement('i');
      icon.className = 'fas fa-inbox';
      icon.setAttribute('aria-hidden', 'true');
      const heading = document.createElement('strong');
      const text = document.createElement('span');
      if (messages.length === 0) {
        heading.textContent = 'No website messages yet';
        text.textContent = 'Messages submitted through the home page Contact form will appear here.';
      } else {
        heading.textContent = 'No matching messages';
        text.textContent = 'Try another name, email, service, or keyword.';
      }
      empty.append(icon, heading, text);
      messageList.appendChild(empty);
      return;
    }

    filteredMessages.forEach(message => messageList.appendChild(createMessageCard(message)));
  }

  function persistContacts(nextContacts) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextContacts));
      contacts = nextContacts;
      storageReady = true;
      renderContacts();
      return true;
    } catch (error) {
      showStatus(`Could not save contacts in this browser: ${error.message}`, true);
      return false;
    }
  }

  function updateDashboard() {
    const recentContacts = [...contacts]
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
      .slice(0, 5);

    dashboardTotal.textContent = String(contacts.length);
    dashboardRecentCount.textContent = String(recentContacts.length);
    dashboardRecentList.replaceChildren();

    if (recentContacts.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'dashboard-empty';
      empty.textContent = 'No contacts yet. Add someone to see them here.';
      dashboardRecentList.appendChild(empty);
      return;
    }

    recentContacts.forEach(contact => {
      const row = document.createElement('div');
      row.className = 'recent-contact-row';
      const avatar = document.createElement('span');
      avatar.className = 'recent-contact-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = contact.name.trim().charAt(0).toUpperCase();
      const copy = document.createElement('div');
      copy.className = 'recent-contact-copy';
      const name = document.createElement('strong');
      name.textContent = contact.name;
      const detail = document.createElement('span');
      detail.textContent = contact.email;
      copy.append(name, detail);
      row.append(avatar, copy);
      dashboardRecentList.appendChild(row);
    });
  }

  function showView(viewId) {
    const showDashboard = viewId === 'dashboardView';
    dashboardView.hidden = !showDashboard;
    contactsView.hidden = showDashboard;
    pageTitle.textContent = showDashboard ? 'Dashboard' : 'Contact Manager';
    sidebarTabs.forEach(tab => {
      const isActive = tab.dataset.view === viewId;
      tab.classList.toggle('active', isActive);
      if (isActive) {
        tab.setAttribute('aria-current', 'page');
      } else {
        tab.removeAttribute('aria-current');
      }
    });
  }

  function createContactCard(contact) {
    const card = document.createElement('article');
    card.className = 'contact-card';

    const details = document.createElement('div');
    details.className = 'contact-card-main';
    const name = document.createElement('h3');
    name.textContent = contact.name;
    details.appendChild(name);

    const email = document.createElement('p');
    email.innerHTML = '<i class="fas fa-envelope" aria-hidden="true"></i> ';
    email.append(document.createTextNode(contact.email));
    details.appendChild(email);

    if (contact.phone) {
      const phone = document.createElement('p');
      phone.innerHTML = '<i class="fas fa-phone" aria-hidden="true"></i> ';
      phone.append(document.createTextNode(contact.phone));
      details.appendChild(phone);
    }

    if (contact.company) {
      const company = document.createElement('p');
      company.innerHTML = '<i class="fas fa-building" aria-hidden="true"></i> ';
      company.append(document.createTextNode(contact.company));
      details.appendChild(company);
    }

    if (contact.notes) {
      const notes = document.createElement('p');
      notes.className = 'contact-notes';
      notes.textContent = contact.notes;
      details.appendChild(notes);
    }

    const actions = document.createElement('div');
    actions.className = 'contact-card-actions';
    const editButton = document.createElement('button');
    editButton.className = 'contact-action';
    editButton.type = 'button';
    editButton.setAttribute('aria-label', `Edit ${contact.name}`);
    editButton.title = 'Edit contact';
    editButton.innerHTML = '<i class="fas fa-pen" aria-hidden="true"></i>';
    editButton.addEventListener('click', () => startEditing(contact));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'contact-action delete';
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Delete ${contact.name}`);
    deleteButton.title = 'Delete contact';
    deleteButton.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i>';
    deleteButton.addEventListener('click', () => deleteContact(contact));

    actions.append(editButton, deleteButton);
    card.append(details, actions);
    return card;
  }

  function renderContacts() {
    const query = searchInput.value.trim().toLowerCase();
    const filteredContacts = contacts
      .filter(contact => [contact.name, contact.email, contact.phone, contact.company]
        .some(value => value.toLowerCase().includes(query)))
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));

    count.textContent = String(contacts.length);
    countLabel.textContent = contacts.length === 1 ? 'contact' : 'contacts';
    updateDashboard();
    contactList.replaceChildren();

    if (!storageReady) {
      const error = document.createElement('p');
      error.className = 'empty-contacts';
      error.textContent = 'Contacts could not be loaded. Resolve the browser storage issue before making changes.';
      contactList.appendChild(error);
      return;
    }

    if (filteredContacts.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-contacts';
      const icon = document.createElement('i');
      icon.className = 'fas fa-address-book';
      icon.setAttribute('aria-hidden', 'true');
      const heading = document.createElement('strong');
      const message = document.createElement('span');

      if (contacts.length === 0) {
        heading.textContent = 'No contacts yet';
        message.textContent = 'Add your first contact using the form.';
      } else {
        heading.textContent = 'No matching contacts';
        message.textContent = 'Try another name, email, phone, or company.';
      }

      empty.append(icon, heading, message);
      contactList.appendChild(empty);
      return;
    }

    filteredContacts.forEach(contact => contactList.appendChild(createContactCard(contact)));
  }

  function startEditing(contact) {
    editingId = contact.id;
    Object.keys(fields).forEach(key => {
      fields[key].value = contact[key];
    });
    formTitle.textContent = 'Edit contact';
    saveButton.innerHTML = '<i class="fas fa-floppy-disk" aria-hidden="true"></i> Save changes';
    cancelButton.hidden = false;
    showStatus(`Editing ${contact.name}.`);
    fields.name.focus();
  }

  function resetForm() {
    editingId = null;
    form.reset();
    formTitle.textContent = 'Add a contact';
    saveButton.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i> Add contact';
    cancelButton.hidden = true;
  }

  function deleteContact(contact) {
    if (!window.confirm(`Delete ${contact.name} from your contacts?`)) return;
    const nextContacts = contacts.filter(savedContact => savedContact.id !== contact.id);
    if (persistContacts(nextContacts)) {
      if (editingId === contact.id) resetForm();
      showStatus(`${contact.name} was deleted.`);
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!storageReady) {
      showStatus('Contact storage is unavailable. Reload the page and check browser storage settings.', true);
      return;
    }

    const values = Object.fromEntries(
      Object.entries(fields).map(([key, field]) => [key, field.value.trim()])
    );
    const duplicate = contacts.some(contact =>
      contact.email.toLowerCase() === values.email.toLowerCase() && contact.id !== editingId
    );

    if (duplicate) {
      showStatus('A contact with this email address already exists.', true);
      fields.email.focus();
      return;
    }

    const editingContact = contacts.find(contact => contact.id === editingId);
    const contact = {
      id: editingContact ? editingContact.id : (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      ...values,
      createdAt: editingContact ? editingContact.createdAt : new Date().toISOString()
    };
    const nextContacts = editingContact
      ? contacts.map(savedContact => savedContact.id === editingId ? contact : savedContact)
      : [...contacts, contact];

    if (persistContacts(nextContacts)) {
      resetForm();
      showStatus(editingContact ? 'Contact updated.' : 'Contact added.');
    }
  });

  cancelButton.addEventListener('click', () => {
    resetForm();
    showStatus('Editing cancelled.');
  });

  sidebarTabs.forEach(tab => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });

  document.querySelectorAll('[data-open-contacts]').forEach(button => {
    button.addEventListener('click', () => showView('contactsView'));
  });

  messageList.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const actionButton = event.target.closest('[data-message-action]');
    if (!actionButton) return;

    const messageId = actionButton.dataset.messageId;
    const message = messages.find(savedMessage => savedMessage.id === messageId);
    if (!message) return;

    if (actionButton.dataset.messageAction === 'edit') {
      editingMessageId = messageId;
      renderMessages();
    } else if (actionButton.dataset.messageAction === 'cancel') {
      editingMessageId = null;
      renderMessages();
      showMessageStatus('Message edit cancelled.');
    } else if (actionButton.dataset.messageAction === 'delete') {
      if (!window.confirm(`Delete the website message from ${message.name}?`)) return;
      const nextMessages = messages.filter(savedMessage => savedMessage.id !== messageId);
      if (persistMessages(nextMessages, 'Website message deleted.')) {
        if (editingMessageId === messageId) editingMessageId = null;
        renderMessages();
      }
    }
  });

  messageList.addEventListener('submit', event => {
    if (!(event.target instanceof HTMLFormElement) || !event.target.matches('.message-edit-form')) return;
    event.preventDefault();
    const editForm = event.target;
    const messageId = editForm.dataset.messageId;
    const existingMessage = messages.find(message => message.id === messageId);
    if (!existingMessage) {
      showMessageStatus('This message could not be found. Reload the page and try again.', true);
      return;
    }

    const updatedFields = Object.fromEntries(new FormData(editForm).entries());
    const nextMessages = messages.map(message => message.id === messageId
      ? { ...message, ...updatedFields }
      : message);
    editingMessageId = null;
    if (!persistMessages(nextMessages, 'Website message updated.')) {
      editingMessageId = messageId;
      renderMessages();
    }
  });

  messageSearch.addEventListener('input', renderMessages);

  window.addEventListener('storage', event => {
    if (event.key !== messagesStorageKey) return;
    try {
      messages = readMessages();
      messageStorageReady = true;
      renderMessages();
    } catch (error) {
      messageStorageReady = false;
      showMessageStatus(`Could not refresh website messages: ${error.message}`, true);
      renderMessages();
    }
  });

  searchInput.addEventListener('input', renderContacts);

  try {
    contacts = readContacts();
    renderContacts();
    showView('dashboardView');
  } catch (error) {
    storageReady = false;
    showStatus(`Could not load contacts: ${error.message}`, true);
    renderContacts();
  }

  try {
    messages = readMessages();
    renderMessages();
  } catch (error) {
    messageStorageReady = false;
    showMessageStatus(`Could not load website messages: ${error.message}`, true);
    renderMessages();
  }
});
