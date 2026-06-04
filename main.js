document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Drawer Switch
  const menuBtn = document.getElementById("menu-btn");
  const navMenu = document.getElementById("nav-menu");
  
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Client-Side Architecture Properties
  const searchInput = document.getElementById("sidebar-search");
  const searchDropdown = document.getElementById("search-dropdown");
  const archiveList = document.getElementById("sidebar-archive");
  let postIndex = null;

  // Intercept focus to lazy-load the post data payload
  searchInput.addEventListener("focus", async () => {
    if (!postIndex) {
      try {
        const response = await fetch("/data/posts.json");
        postIndex = await response.json();
        buildArchiveWidget(postIndex);
      } catch (err) {
        console.error("Error generating local post indexes:", err);
      }
    }
  });

  // High-Performance Query Evaluator
  searchInput.addEventListener("input", (e) => {
    if (!postIndex) return;
    const query = e.target.value.toLowerCase().trim();
    searchDropdown.innerHTML = "";

    if (query === "") return;

    const matches = postIndex.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(t => t.toLowerCase().includes(query))
    );

    if(matches.length === 0) {
      searchDropdown.innerHTML = `<div style="font-size:0.85rem; padding:0.5rem; color:#666;">No items found.</div>`;
      return;
    }

    matches.slice(0, 6).forEach(match => {
      const item = document.createElement("div");
      item.style.padding = "0.5rem 0";
      item.style.borderBottom = "1px solid #f0f0f0";
      item.innerHTML = `
        <a href="${match.url}" style="font-size:0.9rem; text-decoration:none; color:#007acc; font-weight:600;">${match.title}</a>
        <div style="font-size:0.75rem; color:#666;">${match.date}</div>
      `;
      searchDropdown.appendChild(item);
    });
  });

  // Automated Content Structural Compiler for Archive Registry
  function buildArchiveWidget(posts) {
    if (archiveList.children.length > 0) return; // Prevent duplicate injection steps
    
    const trackingMap = {};
    posts.forEach(post => {
      trackingMap[post.yearMonth] = (trackingMap[post.yearMonth] || 0) + 1;
    });

    Object.keys(trackingMap).forEach(key => {
      const li = document.createElement("li");
      // Encodes dynamic values into explicit tracking parameters
      li.innerHTML = `<a href="/archive.html?period=${encodeURIComponent(key)}">${key}</a> <span>(${trackingMap[key]})</span>`;
      archiveList.appendChild(li);
    });
  }
});
