document.addEventListener("DOMContentLoaded", () => {
  // Navigation Mobile Switcher
  const burgerBtn = document.getElementById("burger-menu-trigger");
  const navDrawer = document.getElementById("main-nav-drawer");
  
  burgerBtn.addEventListener("click", () => {
    navDrawer.classList.toggle("active");
  });

  const searchInp = document.getElementById("sidebar-search-trigger");
  const resultsBox = document.getElementById("search-results-panel");
  const archiveBox = document.getElementById("sidebar-dynamic-archive");
  let jsonIndex = null;

  // Lazy loading the database index on user input intent
  searchInp.addEventListener("focus", async () => {
    if (!jsonIndex) {
      try {
        const response = await fetch("/data/posts.json");
        jsonIndex = await response.json();
        renderArchiveWidget(jsonIndex);
      } catch (err) {
        console.error("Could not fetch internal post catalog mappings:", err);
      }
    }
  });

  // Fast string query comparison engine
  searchInp.addEventListener("input", (e) => {
    if (!jsonIndex) return;
    const query = e.target.value.toLowerCase().trim();
    resultsBox.innerHTML = "";

    if (query === "") return;

    const matchedPosts = jsonIndex.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(t => t.toLowerCase().includes(query))
    );

    if (matchedPosts.length === 0) {
      resultsBox.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted);">No entries matched criteria.</div>`;
      return;
    }

    matchedPosts.slice(0, 5).forEach(post => {
      const row = document.createElement("div");
      row.style.padding = "0.5rem 0";
      row.style.borderBottom = "1px solid var(--border)";
      row.innerHTML = `
        <a href="${post.url}" style="font-size:0.9rem; text-decoration:none; color:var(--brand-dark); font-weight:600;">${post.title}</a>
        <div style="font-size:0.75rem; color:var(--text-muted);">${post.date}</div>
      `;
      resultsBox.appendChild(row);
    });
  });

  function renderArchiveWidget(posts) {
    if (archiveBox.children.length > 0) return; // Prevent loop injection steps
    
    const countData = {};
    posts.forEach(p => {
      countData[p.yearMonth] = (countData[p.yearMonth] || 0) + 1;
    });

    Object.keys(countData).forEach(groupKey => {
      const element = document.createElement("li");
      element.innerHTML = `<a href="/archive.html?period=${encodeURIComponent(groupKey)}">${groupKey}</a> <span style="color:var(--text-muted); font-size:0.8rem;">(${countData[groupKey]})</span>`;
      archiveBox.appendChild(element);
    });
  }
});
