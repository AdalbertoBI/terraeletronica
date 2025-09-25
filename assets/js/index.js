// JS específico da Home (index)
document.addEventListener('DOMContentLoaded', () => {
	initNoticiasCarousel();
	initNoticiasLightbox();
});

function initNoticiasCarousel() {
	const carousel = document.querySelector('.noticias-carousel');
	if (!carousel) return;

	const track = carousel.querySelector('.carousel-track');
	if (!track) return;

	// Cria um inner flex para permitir transições suaves
	const inner = document.createElement('div');
	inner.className = 'carousel-track-inner';
	while (track.firstChild) {
		inner.appendChild(track.firstChild);
	}
	track.appendChild(inner);

	const items = Array.from(inner.children);
	let index = 0;

	const prevBtn = carousel.querySelector('.carousel-btn.prev');
	const nextBtn = carousel.querySelector('.carousel-btn.next');

	// Pré-calcula offsets cumulativos para itens de larguras variáveis
	function getItemWidths() {
		return items.map(el => el.getBoundingClientRect().width);
	}

	function getOffsets(widths, gap) {
		const off = [0];
		for (let i = 1; i < widths.length; i++) {
			off[i] = off[i - 1] + widths[i - 1] + gap;
		}
		return off;
	}

	let gap = 8; // deve bater com o CSS
	let widths = getItemWidths();
	let offsets = getOffsets(widths, gap);

	function update() {
		// Garante que o índice esteja válido com base no espaço visível
		clampIndex();
		const offset = -(offsets[index] || 0);
		inner.style.transform = `translateX(${offset}px)`;
	}

	function clampIndex() {
		const viewport = track.getBoundingClientRect().width;
		// Descobre quantos itens cabem a partir do índice atual para determinar maxIndex
		let maxIndex = 0;
		let acc = 0;
		for (let i = items.length - 1; i >= 0; i--) {
			// Espaço restante a partir de i
			acc = 0;
			let j = i;
			while (j < items.length && acc + widths[j] <= viewport) {
				acc += widths[j] + (j < items.length - 1 ? gap : 0);
				j++;
			}
			if (acc <= viewport) {
				maxIndex = i;
				break;
			}
		}
		if (index < 0) index = 0;
		if (index > maxIndex) index = maxIndex;
	}

	prevBtn?.addEventListener('click', () => {
		index -= 1;
		clampIndex();
		update();
	});

	nextBtn?.addEventListener('click', () => {
		index += 1;
		clampIndex();
		update();
	});

	// Ajuste responsivo no resize
	window.addEventListener('resize', () => {
		widths = getItemWidths();
		offsets = getOffsets(widths, gap);
		clampIndex();
		update();
	});

	// Inicial
	clampIndex();
	update();
}

function initNoticiasLightbox() {
	const carousel = document.querySelector('.noticias-carousel');
	if (!carousel) return;
	const imgs = carousel.querySelectorAll('.carousel-item img');
	if (!imgs.length) return;

	// Cria lightbox na página
	let lightbox = document.createElement('div');
	lightbox.className = 'lightbox';
	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-modal', 'true');
	lightbox.setAttribute('aria-label', 'Imagem ampliada');
	lightbox.innerHTML = `
	  <div class="lightbox-content">
		<button class="lightbox-close" aria-label="Fechar">
		  <i class="fas fa-times" aria-hidden="true"></i>
		</button>
		<img class="lightbox-img" alt="Imagem ampliada" />
	  </div>
	`;
	document.body.appendChild(lightbox);

	const imgEl = lightbox.querySelector('.lightbox-img');
	const closeBtn = lightbox.querySelector('.lightbox-close');

	function open(src, alt) {
		imgEl.src = src;
		imgEl.alt = alt || 'Imagem ampliada';
		lightbox.classList.add('open');
		// foco no botão fechar para acessibilidade
		setTimeout(() => closeBtn.focus(), 0);
		document.addEventListener('keydown', onKey);
	}

	function close() {
		lightbox.classList.remove('open');
		document.removeEventListener('keydown', onKey);
	}

	function onKey(e) {
		if (e.key === 'Escape') close();
	}

	imgs.forEach(img => {
		img.addEventListener('click', () => open(img.src, img.alt));
		img.addEventListener('keypress', (e) => {
			if (e.key === 'Enter' || e.key === ' ') open(img.src, img.alt);
		});
		img.setAttribute('tabindex', '0');
		img.setAttribute('role', 'button');
		img.setAttribute('aria-label', 'Ampliar imagem');
	});

	closeBtn.addEventListener('click', close);
	lightbox.addEventListener('click', (e) => {
		if (e.target === lightbox) close();
	});
}
