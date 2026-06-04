document.addEventListener("DOMContentLoaded", () => {
  // Hamburger Menu Controller
  const toggleBtn = document.getElementById("menu-toggle-btn");
  const navMenu = document.getElementById("navbar-menu");
  
  toggleBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  const searchInput = document.getElementById("tech-search");
  const searchOutput = document.getElementById("search-output-box");
  const archiveContainer = document.getElementById("dynamic-archive-list");
  let dataPayload = null;

  // Lazy-load internal indices upon user search intent
  searchInput.addEventListener("focus", async () => {
    if (!dataPayload) {
      try {
        const res = await fetch("/data/posts.json");
        dataPayload = await res.json();
        generateArchiveMap(dataPayload);
      } catch (err) {
        console.error("Failed compiling internal indexing:", err);
      }
    }
  });

  // Pure Search Matching Algorithm
  searchInput.addEventListener("input", (e) => {
    if (!dataPayload) return;
    const query = e.target.value.toLowerCase().trim();
    searchOutput.innerHTML = "";

    if (query === "") return;

    const filtered = dataPayload.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
      searchOutput.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted);">No logs found matching criteria.</div>`;
      return;
    }

    filtered.slice(0, 5).forEach(post => {
      const wrapper = document.createElement("div");
      wrapper.style.padding = "0.5rem 0";
      wrapper.style.borderBottom = "1px solid var(--border-color)";
      wrapper.innerHTML = `
        <a href="${post.url}" style="font-size:0.9rem; text-decoration:none; color:var(--accent); font-weight:600;">${post.title}</a>
        <div style="font-size:0.75rem; color:var(--text-muted);">${post.date}</div>
      `;
      searchOutput.appendChild(wrapper);
    });
  });

  // Populates the structural Month/Year lists
  function generateArchiveMap(posts) {
    if (archiveContainer.children.length > 0) return;
    
    const countMap = {};
    posts.forEach(p => {
      countMap[p.yearMonth] = (countMap[p.yearMonth] || 0) + 1;
    });

    Object.keys(countMap).forEach(mYear => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="/archive.html?filter=${encodeURIComponent(mYear)}">${mYear}</a> <span style="color:var(--text-muted); font-size:0.85rem;">(${countMap[mYear]})</span>`;
      archiveContainer.appendChild(li);
    });
  }
});
