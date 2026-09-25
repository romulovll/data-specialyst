var STUDYHUB_API = 'https://studyhub-api-881000472963.southamerica-east1.run.app/api';

function isLoggedIn() {
  return !!localStorage.getItem('studyhub_token');
}

function getAuthHeaders() {
  var token = localStorage.getItem('studyhub_token');
  if (!token) return null;
  return { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
}

function logout() {
  localStorage.removeItem('studyhub_token');
  localStorage.removeItem('studyhub_email');
  window.location.reload();
}

function getEmail() {
  return localStorage.getItem('studyhub_email') || '';
}

function loadProgressFromAPI(storageKey) {
  var headers = getAuthHeaders();
  if (!headers) {
    // Not logged in — use localStorage only
    try { var s = localStorage.getItem(storageKey); if (s) checkedItems = JSON.parse(s); } catch(e) {}
    return Promise.resolve();
  }
  return fetch(STUDYHUB_API + '/progress/' + storageKey, { headers: headers })
    .then(function(r) {
      if (r.status === 401) {
        localStorage.removeItem('studyhub_token');
        localStorage.removeItem('studyhub_email');
        return null;
      }
      return r.json();
    })
    .then(function(d) {
      if (d) {
        checkedItems = d.progress || {};
        try { localStorage.setItem(storageKey, JSON.stringify(checkedItems)); } catch(e) {}
      }
    })
    .catch(function() {
      try { var s = localStorage.getItem(storageKey); if (s) checkedItems = JSON.parse(s); } catch(e) {}
    });
}

function renderAuthStatus() {
  var el = document.getElementById('authStatus');
  if (!el) return;
  if (isLoggedIn()) {
    el.innerHTML = '<small style="color:#9ca3af">' + getEmail() + '</small> &middot; <a href="#" onclick="logout()" style="color:#06b6d4;text-decoration:none;font-size:.75rem">Logout</a>';
  } else {
    el.innerHTML = '<a href="login.html?redirect=' + encodeURIComponent(window.location.pathname.split("/").pop()) + '" style="color:#f59e0b;text-decoration:none;font-size:.75rem">Sign in to sync progress</a>';
  }
}

document.addEventListener('DOMContentLoaded', renderAuthStatus);

function saveProgressToAPI(storageKey) {
  // Always save to localStorage (works without login)
  try { localStorage.setItem(storageKey, JSON.stringify(checkedItems)); } catch(e) {}
  // Only sync to API if logged in
  var headers = getAuthHeaders();
  if (!headers) return;
  fetch(STUDYHUB_API + '/progress/' + storageKey, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({ progress: checkedItems })
  }).catch(function() {});
}
