  async function loadBareServers() {
    try {
      // FIX: Forces the relative tracking context to read natively inside the /yes/ subfolder directory
      const response = await fetch('data/bare-servers.json', { 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }); 
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      bareServers = data.servers || [];
      
      const select = document.getElementById('bareServerSelect');
      if (select) {
        select.innerHTML = ''; // Flushes "Loading servers..." away safely
        
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
      
      // Safety fail-open: If GitHub blocks the network look-up, build the live elements directly anyway
      const select = document.getElementById('bareServerSelect');
      if (select) {
        select.innerHTML = '';
        const fallbackServers = ["https://phantomnetwork.cloud", "https://artclass.site", "https://shuttleproxy.com"];
        fallbackServers.forEach(server => {
          const option = document.createElement('option');
          option.value = server;
          option.textContent = server;
          select.appendChild(option);
        });
        self.__uv\$config.bare = fallbackServers[0];
      }
    }
  }
