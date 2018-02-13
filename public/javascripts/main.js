'use strict';

function main () {
  const canvas = document.getElementById('my-chart');
  const ctx = canvas.getContext('2d');
  console.log('test axios');

  function requestGraphData () {
    const id = window.location.href.slice(38);// document.URL format to get only the id
    axios.get('/api/draw-my-chart/' + id)
      .then(result => {
        console.log('result:' + result.data);
      }).catch(err => {
        console.error(err);
      });
  }

  document.getElementById('chartButton').onclick = function () {
    console.log('button clicked');
    requestGraphData();
  };

  // const lineChart = new Chart(ctx, {
  //   data: {
  //     labels: keyArray,
  //     datasets: [{
  //       label: 'monthly transactions',
  //       //   backgroundColor: 'rgb(255, 99, 132)',
  //       borderColor: 'rgb(255, 99, 132)',
  //       data: valueArray
  //     }]
  //   },
  //   type: 'bar',
  //   options: {
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           beginAtZero: true
  //         }
  //       }]
  //     }
  //   }
  // });
}

window.onload = main;
