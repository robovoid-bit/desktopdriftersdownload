  async function loadBareServers() {
    try {
      // Adjusted fetch header rules to prevent browser CORS/MIME-type blocking
      const response = await fetch('./data/bare-servers.json', {
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
      
      // Hardcoded fallback so the UI never breaks or gets stuck if fetch fails
      const select = document.getElementById('bareServerSelect');
      if (select) {
        select.innerHTML = '';
        const fallbackServers = ["https://tomp.app", "https://phantomnetwork.cloud"];
        fallbackServers.forEach(server => {
          const option = document.createElement('option');
          option.value = server;
          option.textContent = server + " (Fallback)";
          select.appendChild(option);
        });
        self.__uv\$config.bare = fallbackServers[0];
      }
    }
  }
