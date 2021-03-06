'use strict';

function main () {
  const canvas = document.getElementById('my-chart');
  const ctx = canvas.getContext('2d');
  // console.log('test axios');

  function requestGraphData () {
    const id = window.location.href.slice(38);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    axios.get('/api/draw-my-chart/' + id)
      .then(result => {
        console.log('result:' + result.data);
        const lineChart = new Chart(ctx, {
          data: {
            labels: result.data.xArray,
            datasets: [
              { label: 'monthly cost',
                fillColor: 'rgba(220,220,220,0.2)',
                strokeColor: 'rgba(220,220,220,1)',
                data: result.data.yArrayCost,
                backgroundColor: 'orange'
              },
              { label: 'monthly revenue',
                fillColor: 'rgba(151,187,205,0.2)',
                strokeColor: 'rgba(151,187,205,1)',
                data: result.data.yArrayRev,
                backgroundColor: 'yellow'
              }
            ]
          },
          type: 'line',
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      }).catch(err => {
        console.error(err);
      });
  }

  document.getElementById('chartButton').onclick = function () {
    console.log('button clicked');
    requestGraphData();
  };
}

window.onload = main;
