if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service worker.js')
      .then(reg => console.log('Service Worker Registered', reg))
      .catch(err => console.log('Service Worker Failed', err));
}

async function fetchPosts() {
  try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts = await response.json();
      const postsContainer = document.getElementById('posts');
      
      localStorage.setItem('cachedPosts', JSON.stringify(posts)); // Simpan ke localStorage

      postsContainer.innerHTML = posts.slice(0, 10).map(post => `
          <div class="post">
              <h2>${post.title}</h2>
              <p>${post.body}</p>
              <p class="id">Post ID: ${post.id}</p>
          </div>
      `).join('');
  } catch (error) {
      console.log("Fetching failed, loading from cache...");

      const cachedPosts = localStorage.getItem('cachedPosts');
      if (cachedPosts) {
          const postsContainer = document.getElementById('posts');
          const posts = JSON.parse(cachedPosts);
          postsContainer.innerHTML = posts.slice(0, 10).map(post => `
              <div class="post">
                  <h2>${post.title}</h2>
                  <p>${post.body}</p>
                  <p class="id">Post ID: ${post.id}</p>
              </div>
          `).join('');
      } else {
          document.getElementById('posts').innerHTML = '<p>Failed to load posts.</p>';
      }
  }
}
fetchPosts();
