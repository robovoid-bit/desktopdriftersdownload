/* BETA CONFIG */

self.__uv\$config = {
  prefix: '/uv/service/',
  bare: 'https://tomp.app/', // Default server
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: '/uv/uv.handler.js',
  bundle: '/uv/uv.bundle.js',
  config: '/uv/uv.config.js',
  sw: '/uv/uv.sw.js',
};

// Only run DOM code if we are in the main browser window (not the Service Worker)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  let bareServers = [];

  // Load the list of bare servers when the script runs
  async function loadBareServers() {
    try {
      const response = await fetch('/data/bare-servers.json'); 
      const data = await response.json();
      bareServers = data.servers || [];
      
      const select = document.getElementById('bareServerSelect');
      if (select) {
        // Clear any hardcoded options first
        select.innerHTML = '';
        
        bareServers.forEach(server => {
          const option = document.createElement('option');
          option.value = server;
          option.textContent = server;
          select.appendChild(option);
        });
        
        // Match config bare to whatever default option loaded
        if (select.value) {
          self.__uv\$config.bare = select.value;
        }
      }
    } catch (error) {
      console.error('Error loading bare servers:', error);
    }
  }

  // Function to handle user selection and update the 'bare' property
  function handleServerSelection() {
    const select = document.getElementById('bareServerSelect');
    if (select) {
      const selectedServer = select.value;
      self.__uv\$config.bare = selectedServer;
      console.log(`Config updated to bare server: ${selectedServer}`);
    }
  }

  // Load the list of bare servers when the script runs
  window.addEventListener('DOMContentLoaded', () => {
    loadBareServers();
    
    const select = document.getElementById('bareServerSelect');
    if (select) {
      select.addEventListener('change', handleServerSelection);
    }
  });
}
