document.addEventListener('DOMContentLoaded', function () {
  chrome.tabGroups.query({}, function (groups) {
    const list = document.getElementById('tabGroupsList');
    if (groups.length === 0) {
      list.innerHTML = '<li>No tab groups found.</li>';
    } else {
      groups.forEach(group => {
        const listItem = document.createElement('li');
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export';
        exportBtn.onclick = function() {
          exportTabs(group.id, group.title || `Group ${group.id}`);
        };
        listItem.textContent = group.title ? group.title : `Group ${group.id} (No Title)`;
        listItem.appendChild(exportBtn);
        list.appendChild(listItem);
      });
    }
  });
});

function exportTabs(groupId, groupName) {
  chrome.tabs.query({ groupId: groupId }, function(tabs) {
    const tabData = tabs.map(tab => [tab.title, tab.url]);
    const csvContent = "data:text/csv;charset=utf-8," 
                     + tabData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tab-group-${groupName}.csv`);
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link);
  });
}
