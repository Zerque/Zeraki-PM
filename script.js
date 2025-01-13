// Function to render the feedback table
function renderFeedbackTable() {
    const feedbackTable = JSON.parse(localStorage.getItem('feedbackTable')) || [];
    const feedbackTableBody = document.getElementById('feedback-table-body');

    feedbackTableBody.innerHTML = ''; // Clear previous content

    feedbackTable.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>
                <button onclick="archiveFeedback(${index})">Archive</button>
                <button onclick="moveToIdeaBacklog(${index})">Move to Idea Backlog</button>
            </td>
        `;
        feedbackTableBody.appendChild(row);
    });
}

// Add feedback to the table
function addFeedback(title, description) {
    const feedbackTable = JSON.parse(localStorage.getItem('feedbackTable')) || [];
    feedbackTable.push({ title, description });
    localStorage.setItem('feedbackTable', JSON.stringify(feedbackTable));
    renderFeedbackTable();
    showDialog('Feedback added successfully! Do you want to save it?', 'Save Feedback', () => {
        saveFeedbackTable();
    });
}

// Archive feedback
function archiveFeedback(index) {
    const feedbackTable = JSON.parse(localStorage.getItem('feedbackTable')) || [];
    const archiveBacklog = JSON.parse(localStorage.getItem('archiveBacklog')) || [];

    const [archivedItem] = feedbackTable.splice(index, 1);
    archiveBacklog.push(archivedItem);

    localStorage.setItem('feedbackTable', JSON.stringify(feedbackTable));
    localStorage.setItem('archiveBacklog', JSON.stringify(archiveBacklog));
    renderFeedbackTable();
    showDialog(`${archivedItem.title} has been archived.`);
}

// Move feedback to idea backlog
function moveToIdeaBacklog(index) {
    const feedbackTable = JSON.parse(localStorage.getItem('feedbackTable')) || [];
    const ideaBacklog = JSON.parse(localStorage.getItem('ideaBacklog')) || [];

    const [movedItem] = feedbackTable.splice(index, 1);
    ideaBacklog.push({ ...movedItem, votes: 0 });

    localStorage.setItem('feedbackTable', JSON.stringify(feedbackTable));
    localStorage.setItem('ideaBacklog', JSON.stringify(ideaBacklog));
    renderFeedbackTable();
    window.location.href = 'idea.html'; // Redirect to the Idea Backlog page
}

// Promote idea to product backlog
function promoteToProductBacklog(index) {
    const ideaBacklog = JSON.parse(localStorage.getItem('ideaBacklog')) || [];
    const productBacklog = JSON.parse(localStorage.getItem('productBacklog')) || [];

    const [promotedItem] = ideaBacklog.splice(index, 1);
    productBacklog.push(promotedItem);

    localStorage.setItem('ideaBacklog', JSON.stringify(ideaBacklog));
    localStorage.setItem('productBacklog', JSON.stringify(productBacklog));
    renderIdeaBacklog();
    alert(`${promotedItem.title} has been moved to the Product Backlog.`);
    window.location.href = 'product.html'; // Redirect to the Product Backlog page
}

// Save feedback table
function saveFeedbackTable() {
    const feedbackTable = JSON.parse(localStorage.getItem('feedbackTable')) || [];
    localStorage.setItem('feedbackTable', JSON.stringify(feedbackTable));
    showDialog('Feedback saved successfully!');
}

// Show a dialog box
function showDialog(message, confirmText = 'OK', confirmCallback = null) {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.padding = '20px';
    dialog.style.backgroundColor = '#fff';
    dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dialog.style.borderRadius = '8px';
    dialog.style.zIndex = '1000';

    const messageEl = document.createElement('p');
    messageEl.textContent = message;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '10px';

    const confirmButton = document.createElement('button');
    confirmButton.textContent = confirmText;
    confirmButton.style.backgroundColor = '#4CAF50';
    confirmButton.style.color = '#fff';
    confirmButton.style.border = 'none';
    confirmButton.style.padding = '10px 20px';
    confirmButton.style.borderRadius = '5px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.addEventListener('click', () => {
        dialog.remove();
        if (confirmCallback) confirmCallback();
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.backgroundColor = '#f44336';
    cancelButton.style.color = '#fff';
    cancelButton.style.border = 'none';
    cancelButton.style.padding = '10px 20px';
    cancelButton.style.borderRadius = '5px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.addEventListener('click', () => {
        dialog.remove();
    });

    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);

    dialog.appendChild(messageEl);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
}

// Render the initial data on page load
document.addEventListener('DOMContentLoaded', () => {
    renderFeedbackTable();
    renderIdeaBacklog();
});
