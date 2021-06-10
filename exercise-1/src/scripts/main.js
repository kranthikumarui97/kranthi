function getData() {
	axios.get('https://5dc588200bbd050014fb8ae1.mockapi.io/assessment').then(function (response) {
		const data = { data: response.data };
		var source = document.getElementById('entry-template').innerHTML;
		var template = Handlebars.compile(source);
		var html = template(data);
		document.getElementById('container').innerHTML = html;
		return data;
	});
}

function showBtn(id, createdAt) {
	var dataRow = document.getElementById(id);
	if (dataRow.querySelector('button').innerText === 'Show') {
		dataRow.querySelector('button').innerText = 'Hide';
		var idElement = document.createElement('p');
		var createdAtElement = document.createElement('p');
		idElement.innerText = `Id: ${id}`;
		createdAtElement.innerText = `CreatedAt: ${createdAt}`;
		dataRow.querySelector('div').appendChild(idElement);
		dataRow.querySelector('div').appendChild(createdAtElement);
	} else {
		dataRow.querySelector('button').innerText = 'Show';
		while (dataRow.querySelector('div p')) {
			dataRow.querySelector('div').removeChild(dataRow.querySelector('div p'));
		}
	}
}

document.addEventListener("DOMContentLoaded", getData);

module.exports = {getData, showBtn};