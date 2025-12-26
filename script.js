Papa.parse('data/happiness2024.csv', {
  download: true,
  header: true,
  complete: function(results) {
    console.log("CSV loaded! Columns:", results.meta.fields);
    console.log("First row:", results.data[0]);

    // Auto-find columns (case-insensitive)
    let countryCol = results.meta.fields.find(f => f.toLowerCase().includes('country'));
    let scoreCol = results.meta.fields.find(f => f.toLowerCase().includes('ladder') || f.toLowerCase().includes('score') || f.toLowerCase().includes('happiness'));

    if (!countryCol || !scoreCol) {
      console.error("Couldn't find country or score column! Check console for exact names.");
      return;
    }

    console.log("Using country column:", countryCol, "and score column:", scoreCol);

    let sortedData = results.data
      .filter(row => row[scoreCol] && row[countryCol])
      .sort((a, b) => parseFloat(b[scoreCol]) - parseFloat(a[scoreCol]))
      .slice(0, 10);

    const labels = sortedData.map(row => row[countryCol]);
    const scores = sortedData.map(row => parseFloat(row[scoreCol]));

    // Highest at top
    labels.reverse();
    scores.reverse();

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: scores,
          backgroundColor: '#FFD60A',  // Single bright happy yellow
          borderColor: '#333',
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => 'Score: ' + ctx.raw.toFixed(2) } }
        },
        scales: {
          x: { min: 0, max: 8.5, ticks: { stepSize: 1, font: { size: 14 } } },
          y: { ticks: { font: { size: 16 } } }
        }
      }
    });
  },
  error: function(err) { console.error("Load error:", err); }
});
