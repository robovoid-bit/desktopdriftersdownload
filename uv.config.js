/* Aero Proxy | Ultraviolet Beta Configuration */

self.__uv\$config = {
  prefix: '/uv/service/',
  bare: 'https://tomp.app', // Default fallback server
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: '/uv/uv.handler.js',
  bundle: '/uv/uv.bundle.js',
  config: '/uv/uv.config.js',
  sw: '/uv/uv.sw.js',
};

// DOM isolation wrapper to prevent Service Worker compilation failure
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  let bareServers = [];

  async function loadBareServers() {
    try {
      const response = await fetch('/data/bare-servers.json'); 
      const data = await response.json();
      bareServers = data.servers || [];
      
      const select = document.getElementById('bareServerSelect');
      if (select) {
        select.innerHTML = ''; // Flush placeholder entry
        
        bareServers.forEach(server => {
          const option = document.createElement('option');
          option.value = server;
          option.textContent = server;
          select.appendChild(option);
        });
        
        if (select.value) {
          self.__uv\$config.bare = select.value;
        }
      }
    } catch (error) {
      console.error('Error loading bare servers:', error);
    }
  }

  function handleServerSelection() {
    const select = document.getElementById('bareServerSelect');
    if (select) {
      self.__uv\$config.bare = select.value;
      console.log(`Bare routing engine point changed to: ${select.value}`);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadBareServers();
    
    const select = document.getElementById('bareServerSelect');
    if (select) {
      select.addEventListener('change', handleServerSelection);
    }
  });
}
