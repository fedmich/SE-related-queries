// app.js
document.addEventListener("DOMContentLoaded", () => {
    const queryForm = document.getElementById("queryForm");
    const queryBody = document.getElementById("queryBody");

    // Fetch and display existing queries
    fetchQueries();

    queryForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission
        const mainQuery = document.getElementById("mainQuery").value;
        const relatedQueries = document.getElementById("relatedQueries").value;

        const response = await fetch('backend.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'add_query',
                mainQuery: mainQuery,
                relatedQueries: relatedQueries
            })
        });

        const result = await response.json();
        alert(result.message);
        if (result.success) {
            queryForm.reset(); // Reset form after successful insertion
            fetchQueries(); // Refresh the queries displayed
        }
    });

    async function fetchQueries() {
        const response = await fetch('backend.php?action=get_queries');
        const result = await response.json();
        
        if (result.success) {
            queryBody.innerHTML = ''; // Clear existing table content
            result.queries.forEach(query => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td class="py-2 px-4 border-b">${query.id}</td>
                    <td class="py-2 px-4 border-b">${query.query_text}</td>
                    <td class="py-2 px-4 border-b">
                        <button class="showRelatedBtn text-blue-500" data-id="${query.id}">Show Related</button>
                        <div class="relatedQueries hidden" id="relatedQueries_${query.id}"></div>
                    </td>
                `;
                queryBody.appendChild(tr);
            });

            // Add event listeners for showing related queries
            document.querySelectorAll('.showRelatedBtn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const queryId = e.target.getAttribute('data-id');
                    const relatedDiv = document.getElementById(`relatedQueries_${queryId}`);
                    if (relatedDiv.classList.contains('hidden')) {
                        const relatedResponse = await fetch(`backend.php?action=get_related&id=${queryId}`);
                        const relatedResult = await relatedResponse.json();
                        if (relatedResult.success) {
                            relatedDiv.innerHTML = relatedResult.related.map(related => `<div>${related.related_query_text}</div>`).join('');
                        }
                        relatedDiv.classList.remove('hidden');
                    } else {
                        relatedDiv.classList.add('hidden');
                    }
                });
            });
        }
    }
});
