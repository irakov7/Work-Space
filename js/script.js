const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";
const VACANCY_URL = "api/vacancy";
const BOT_TOKEN = '7468291171:AAH4JYwiRhNZa4IHh35XNT--QY-iImkgOJQ';

let lastUrl = "";
let pagination = {};

const getData = async (url, cbSuccess, cbError) => {
	try {
		const response = await fetch(url);
		const data = await response.json();
		cbSuccess(data);
	} catch (err) {
		cbError(err);
	}
};

const createCard = vacancy => `
	<article class="vacancy" tabindex="0" data-id=${vacancy.id}>
		<img class="vacancy__img" src="${API_URL}${vacancy.logo}" alt="logo yadro">

		<p class="vacancy__company">${vacancy.company}</p>
		<h3 class="vacancy__title">${vacancy.title}</h3>

		<ul class="vacancy__fields">
			<li class="vacancy__field">от ${parseInt(vacancy.salary).toLocaleString()}$</li>
			<li class="vacancy__field">${vacancy.format}</li>
			<li class="vacancy__field">${vacancy.type}</li>
			<li class="vacancy__field">${vacancy.experience}</li>
		</ul>
	</article>
`;

const createCards = (data) => 
	data.vacancies.map(vacancy => {
		const li = document.createElement('li');
		li.classList.add('cards__item');
		li.insertAdjacentHTML("beforeend", createCard(vacancy));
		return li;
});
	
const renderVacancy = (data) => {
	const cardsList = document.querySelector(".cards__list");
	cardsList.textContent = '';
	const cards = createCards(data);
	cardsList.append(...cards);
	
	if (data.pagination) {
		Object.assign(pagination, data.pagination);
	}
	observer.observe(cardsList.lastElementChild);
};

const renderMoreVacancies = (data) => {
	const cardsList = document.querySelector(".cards__list");
	const cards = createCards(data);
	cardsList.append(...cards);
	
	if (data.pagination) {
		Object.assign(pagination, data.pagination);
	}
	observer.observe(cardsList.lastElementChild);
};

const loadMoreVacancies = () => {
	if (pagination.totalPages > pagination.currentPage) {
		const urlWithParams = new URL(lastUrl);
		urlWithParams.searchParams.set("page", pagination.currentPage + 1);

		getData(urlWithParams, renderMoreVacancies, renderError).then(() => {
			lastUrl = urlWithParams;
		});
	}
};
	
const renderError = err => {
	console.warn(err);
};

const createDetailVacancy = ({
	id,
	title,
	company,
	description,
	email,
	salary,
	type,
	format,
	experience,
	location,
	logo,
}) => `
			<article class="detail">
				<div class="detail__header">
					<img class="detail__logo" src="${API_URL}${logo}">
					<p class="detail__compani">${company}</p>
					<h2 class="detail__item">${title}</h2>
				</div>

				<div class="detail__main">
					<p class="detail__description">${description.replaceAll("\n", "<br></br>")}</p>
					<ul class="ditail__fields">
						<li class="ditail__field">от ${parseInt(salary).toLocaleString()}$</li>
						<li class="ditail__field">${type}</li>
						<li class="ditail__field">${format}</li>
						<li class="ditail__field">${experience}</li>
						<li class="ditail__field">${location}</li>
					</ul>
				</div>

				${isNaN(parseInt(id.slice(-1))) ?
				`
				<p class="ditail__resume">Отправляйте резюме на 
					<a class="blue-text" href="mailto:${email}">${email}</a>
				</p>
				` :
				`<form class="detail__tg">
					<input class="detail__input" type="text" name="message" placeholder="Напишите свой email">
					<input name="vacancyId" type="hidden" value="${id}">
					<button class="detail__btn">Отправить</button> 
				</form>
				`}
			</article>
			;

			<button class="modal__close">
				<svg width="20.000000" height="20.000000" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g clip-path="url(#clip8_382)">
						<path id="Vector" d="M10.78 10L15.38 5.39C15.47 5.28 15.52 5.15 15.52 5.01C15.51 4.87 15.45 4.73 15.35 4.64C15.26 4.54 15.12 4.48 14.98 4.47C14.84 4.47 14.71 4.52 14.6 4.61L10 9.21L5.39 4.6C5.28 4.5 5.14 4.44 5 4.44C4.85 4.44 4.7 4.5 4.6 4.6C4.5 4.71 4.44 4.85 4.44 5C4.44 5.14 4.5 5.28 4.6 5.39L9.21 10L4.6 14.6C4.54 14.65 4.5 14.71 4.46 14.78C4.43 14.85 4.41 14.92 4.41 15C4.4 15.08 4.42 15.15 4.44 15.23C4.47 15.3 4.51 15.36 4.57 15.42C4.62 15.47 4.69 15.51 4.76 15.54C4.83 15.57 4.91 15.58 4.98 15.58C5.06 15.57 5.13 15.56 5.2 15.52C5.27 15.49 5.33 15.44 5.38 15.38L10 10.78L14.6 15.38C14.71 15.47 14.84 15.52 14.98 15.52C15.12 15.51 15.26 15.45 15.35 15.35C15.45 15.26 15.51 15.12 15.52 14.98C15.52 14.84 15.47 14.71 15.38 14.6L10.78 10Z" fill="#CCCCCC" fill-opacity="1.000000" fill-rule="nonzero"/>
					</g>
				</svg>
			</button>
`;

const sendTelegram = (modal) => {
	modal.addEventListener('submit', (e) => {
		e.preventDefault()
		const form = e.target.closest('.detail__tg');
		const userId = '894641090';
		const text = `Отклик на вакансию ${form.vacancyId.value}, email: ${form.message.value}`;
		const urlBot = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${userId}&text=${text}`;

		fetch(urlBot)
			.then(res => alert('Успешно отправлено'))
			.catch(err => {
				alert('Ошибка');
				console.log(err);
		});
	});
};

const renderModal = (data) => {
	const modal = document.createElement('div');
	modal.classList.add('modal');
	const modalMain = document.createElement('div');
	modalMain.classList.add('modal__main');
	modalMain.innerHTML = createDetailVacancy(data);
	const modalClose = document.createElement('button');
	modalMain.append(modalClose);
	modal.append(modalMain);
	document.body.append(modal);

	modal.addEventListener('click', ({ target }) => {
	if (target === modal || target.closest(".modal__close")) {
		modal.remove();
		}
	});
	sendTelegram(modal);
};

const openModal = (id) => {
	getData(`${API_URL}${VACANCY_URL}/${id}`, renderModal, renderError);
};

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				loadMoreVacancies();
			}
		});
	},
	{
		rootMargin: "100px",
	},
);

const openFilter = (btn, dropDown, classNameBtn, classNameDd) => {
	dropDown.style.height = `${dropDown.scrollHeight}px`;
	btn.classList.add(classNameBtn);
	dropDown.classList.add(classNameDd);
};
	
const closeFilter = (btn, dropDown, classNameBtn, classNameDd) => {
	dropDown.style.height = '';
	btn.classList.remove(classNameBtn);
	dropDown.classList.remove(classNameDd);
}

const init = (data) => {
	const filterForm = document.querySelector('.filter__form');
	const cardsList = document.querySelector(".cards__list");
	const vacanciesFilterBtn = document.querySelector('.vacancies__filter-btn');
	const vacanciesFilter = document.querySelector('.vacancies__filter');

	vacanciesFilterBtn.addEventListener('click', () => {
		if (vacanciesFilterBtn.classList.contains('vacancies__filter-btn_active')) {
			closeFilter(
				vacanciesFilterBtn,
				vacanciesFilter,
				'vacancies__filter-btn_active',
				'vacancies__filter_active');
		} else {
			openFilter(
				vacanciesFilterBtn,
				vacanciesFilter,
				'vacancies__filter-btn_active',
				"vacancies__filter_active");
		}
	});

	window.addEventListener('resize', () => {
		if (vacanciesFilterBtn.classList.contains('vacancies__filter-btn_active')) {
			closeFilter(
				vacanciesFilterBtn,
				vacanciesFilter,
				'vacancies__filter-btn_active',
				'vacancies__filter_active');
		}
	})

	//select city
	const citySelect = document.querySelector('#city');
	const cityChoices = new Choices(citySelect, {
		itemSelectText: "",
	});

	getData(
		`${API_URL}${LOCATION_URL}`,
		(locationData) => {
			const locations = locationData.map((location) => ({
				value: location,
			}));
			cityChoices.setChoices(locations, 'value', 'label', true);
		},
		(err) => {
			console.log(err);
		},
	);

	//cards vacancy
	const url = new URL(`${API_URL}${VACANCY_URL}`);

	getData(url, renderVacancy, renderError).then(() => {
		lastUrl = url;
	});

	//modal

	cardsList.addEventListener('click', ({ target }) => {
		const vacancyCard = target.closest(".vacancy");

		if (vacancyCard) {
			const vacancyId = vacancyCard.dataset.id;
			openModal(vacancyId);
		}
	});

	//filter
	filterForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const formData = new FormData(filterForm);

		const urlWithParam = new URL(`${API_URL}${VACANCY_URL}`);
		formData.forEach((value, key) => {
			urlWithParam.searchParams.append(key, value);	
		});

		getData(urlWithParam, renderVacancy, renderError).then(() => {
			lastUrl = urlWithParam;
		});
	});
};

init();



	

