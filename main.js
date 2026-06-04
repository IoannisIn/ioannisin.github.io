document.addEventListener("DOMContentLoaded", () => {
  // Mobile Hamburger Navigation Menu
  const menuBtn = document.getElementById("menu-btn");
  const navMenu = document.getElementById("nav-menu");
  
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  const searchInp = document.getElementById("search-input");
  const resultsBox = document.getElementById("search-results");
  const archiveBox = document.getElementById("sidebar-archive");
  let postDatabase = null;

  // Lazy-load του JSON index μόνο όταν ο χρήστης εστιάσει στο Search Bar
  searchInp.addEventListener("focus", async () => {
    if (!postDatabase) {
      try {
        const response = await fetch("/data/posts.json");
        postDatabase = await response.json();
        renderArchiveList(postDatabase);
      } catch (err) {
        console.error("Failed to load local post index database:", err);
      }
    }
  });

  // Live Query Search Logic
  searchInp.addEventListener("input", (e) => {
    if (!postDatabase) return;
    const query = e.target.value.toLowerCase().trim();
    resultsBox.innerHTML = "";

    if (query === "") return;

    const filtered = postDatabase.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      resultsBox.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted);">No logs match query.</div>`;
      return;
    }

    filtered.slice(0, 5).forEach(post => {
      const row = document.createElement("div");
      row.style.padding = "0.4rem 0";
      row.style.borderBottom = "1px solid var(--border)";
      row.innerHTML = `
        <a href="${post.url}" style="font-size:0.85rem; text-decoration:none; color:var(--accent); font-weight:600;">${post.title}</a>
        <div style="font-size:0.7rem; color:var(--text-muted);">${post.date}</div>
      `;
      resultsBox.appendChild(row);
    });
  });

  // Dynamic Month/Year Grouping
  function renderArchiveList(posts) {
    if (archiveBox.children.length > 0) return;
    
    const archiveMap = {};
    posts.forEach(p => {
      archiveMap[p.yearMonth] = (archiveMap[p.yearMonth] || 0) + 1;
    });

    Object.keys(archiveMap).forEach(key => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="/archive.html">${key}</a> <span>(${archiveMap[key]})</span>`;
      archiveBox.appendChild(li);
    });
  }
  
});
