// const apiURL = 'https://api.unsplash.com/photos/random/?client_id=bpGP9X197BhHUyKwCQsGlVGcE7o5IVQSYbSbuu6jvVg';


const axios = require('axios');

async function seedImg() {
	try {
	  const resp = await axios.get('https://api.unsplash.com/photos/random', {
		params: {
		  client_id: 'bpGP9X197BhHUyKwCQsGlVGcE7o5IVQSYbSbuu6jvVg',
		//   collections: 1114848,
		},
	  })
	  console.log(resp.json());
	} catch (err) {
	  console.error(err)
	}
  }

// fetch(apiURL)
// 	.then(response => {
// 		console.log(response.json());
// 	})
// 	// .then(data => {
// 	// 	// console.log(data.urls.raw);
// 	// 	getData(data);
// 	// })
// 	.catch((err) => {
// 		console.log('Error fetching data:', err);
// 	});

// async function getData(response) {
// 	const imgLink = response;
// 	console.log(imgLink);
// }

// getData();