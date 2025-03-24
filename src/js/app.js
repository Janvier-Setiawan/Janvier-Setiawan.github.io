document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("posts");

  // API Endpoint (Ganti dengan API yang sesuai)
  const API_URL = "https://jsonplaceholder.typicode.com/posts"; 

  // Fungsi untuk mengambil data dari API
  async function fetchPosts() {
      try {
          const response = await fetch(API_URL);
          if (!response.ok) {
              throw new Error("Gagal mengambil data");
          }
          const posts = await response.json();
          displayPosts(posts);
      } catch (error) {
          console.error("Error:", error);
          postsContainer.innerHTML = "<p style='color: red;'>Gagal memuat postingan.</p>";
      }
  }

  // Fungsi untuk menampilkan postingan di halaman
  function displayPosts(posts) {
      postsContainer.innerHTML = ""; // Hapus konten lama
      posts.slice(0, 5).forEach(post => { // Ambil 5 postingan pertama
          const postElement = document.createElement("div");
          postElement.classList.add("post");
          postElement.innerHTML = `
              <h3>${post.title}</h3>
              <p>${post.body}</p>
              <hr>
          `;
          postsContainer.appendChild(postElement);
      });
  }

  // Panggil fungsi fetchPosts saat halaman dimuat
  fetchPosts();

  // Service Worker Registration (Jika Ada)
  if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js")
          .then(reg => console.log("Service Worker Registered!", reg))
          .catch(err => console.error("Service Worker Registration Failed", err));
  }
});
