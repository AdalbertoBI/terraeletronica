// JS específico da Home (index)
document.addEventListener('DOMContentLoaded', () => {
	initNoticiasCarousel();
	initNoticiasLightbox();
	initSobreVideosCarousel();
	initVideoModal();
	fixVideoThumbnails();
});

function fixVideoThumbnails() {
	const videoThumbnails = document.querySelectorAll('.video-thumbnail img');
	
	videoThumbnails.forEach(img => {
		// Força o carregamento da imagem
		img.style.display = 'block';
		img.style.opacity = '1';
		
		// Fallback se a imagem não carregar
		img.onerror = function() {
			this.src = 'assets/images/banners/sala-de-musicoterapia.jpeg';
			this.alt = 'Terra Eletrônica - Vídeo Institucional';
		};
		
		// Força reload se não carregou
		if (img.naturalWidth === 0) {
			img.src = img.src + '?t=' + Date.now();
		}
	});
}

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

	// Variáveis para touch/swipe
	let isDown = false;
	let startX;
	let scrollLeft;
	let startTime;

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

	// Touch/Swipe Support
	track.addEventListener('touchstart', (e) => {
		isDown = true;
		startX = e.touches[0].clientX;
		startTime = new Date().getTime();
		inner.style.transition = 'none';
	}, { passive: true });

	track.addEventListener('touchmove', (e) => {
		if (!isDown) return;
		
		const x = e.touches[0].clientX;
		const walk = (x - startX) * 1.5; // Multiplier for sensitivity
		const currentOffset = -(offsets[index] || 0);
		inner.style.transform = `translateX(${currentOffset + walk}px)`;
	}, { passive: true });

	track.addEventListener('touchend', (e) => {
		if (!isDown) return;
		isDown = false;
		
		const endX = e.changedTouches[0].clientX;
		const endTime = new Date().getTime();
		const distance = Math.abs(endX - startX);
		const time = endTime - startTime;
		const velocity = distance / time;
		
		// Reset transition
		inner.style.transition = 'transform 0.4s ease';
		
		// Determine swipe direction and threshold
		if (distance > 30 || velocity > 0.3) { // Minimum swipe distance or velocity
			if (endX > startX) {
				// Swipe right - previous
				index -= 1;
			} else {
				// Swipe left - next
				index += 1;
			}
		}
		
		clampIndex();
		update();
	}, { passive: true });

	// Prevent context menu on long press
	track.addEventListener('contextmenu', (e) => {
		e.preventDefault();
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

function initSobreVideosCarousel() {
	const carousel = document.querySelector('.sobre-videos .videos-carousel');
	if (!carousel) return;

	const track = carousel.querySelector('.carousel-track');
	if (!track) return;

	// Verifica se já existe o inner ou cria um novo
	let inner = track.querySelector('.carousel-track-inner');
	if (!inner) {
		inner = document.createElement('div');
		inner.className = 'carousel-track-inner';
		while (track.firstChild) {
			inner.appendChild(track.firstChild);
		}
		track.appendChild(inner);
	}

	const items = Array.from(inner.children);
	let index = 0;

	const prevBtn = document.getElementById('sobreVideosPrev');
	const nextBtn = document.getElementById('sobreVideosNext');

	// Variáveis para touch/swipe
	let isDown = false;
	let startX;
	let startTime;

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

	let gap = 16; // deve bater com o CSS
	let widths = getItemWidths();
	let offsets = getOffsets(widths, gap);

	function update() {
		// Garante que o índice esteja válido com base no espaço visível
		clampIndex();
		const offset = -(offsets[index] || 0);
		inner.style.transform = `translateX(${offset}px)`;
	}

	function clampIndex() {
		const containerWidth = track.getBoundingClientRect().width;
		const totalWidth = offsets[offsets.length - 1] + widths[widths.length - 1];
		
		if (totalWidth <= containerWidth) {
			index = 0;
			return;
		}

		let maxIndex = 0;
		for (let i = 0; i < offsets.length; i++) {
			if (offsets[i] + containerWidth >= totalWidth) {
				maxIndex = i;
				break;
			}
		}
		
		if (index > maxIndex) index = maxIndex;
		if (index < 0) index = 0;
	}

	function next() {
		if (index < items.length - 1) {
			index++;
			update();
		}
	}

	function prev() {
		if (index > 0) {
			index--;
			update();
		}
	}

	// Event listeners
	if (prevBtn) prevBtn.addEventListener('click', prev);
	if (nextBtn) nextBtn.addEventListener('click', next);

	// Touch/Swipe Support for videos carousel
	track.addEventListener('touchstart', (e) => {
		isDown = true;
		startX = e.touches[0].clientX;
		startTime = new Date().getTime();
		inner.style.transition = 'none';
	}, { passive: true });

	track.addEventListener('touchmove', (e) => {
		if (!isDown) return;
		
		const x = e.touches[0].clientX;
		const walk = (x - startX) * 1.5;
		const currentOffset = -(offsets[index] || 0);
		inner.style.transform = `translateX(${currentOffset + walk}px)`;
	}, { passive: true });

	track.addEventListener('touchend', (e) => {
		if (!isDown) return;
		isDown = false;
		
		const endX = e.changedTouches[0].clientX;
		const endTime = new Date().getTime();
		const distance = Math.abs(endX - startX);
		const time = endTime - startTime;
		const velocity = distance / time;
		
		// Reset transition
		inner.style.transition = 'transform 0.4s ease';
		
		// Determine swipe direction and threshold
		if (distance > 30 || velocity > 0.3) {
			if (endX > startX) {
				// Swipe right - previous
				prev();
			} else {
				// Swipe left - next
				next();
			}
		} else {
			// Snap back to current position
			update();
		}
	}, { passive: true });

	// Prevent context menu on long press
	track.addEventListener('contextmenu', (e) => {
		e.preventDefault();
	});

	// Recalcular ao redimensionar
	window.addEventListener('resize', () => {
		widths = getItemWidths();
		offsets = getOffsets(widths, gap);
		update();
	});

	// Inicializar
	update();
}

function initVideoModal() {
	const modal = document.getElementById('videoModal');
	const modalFrame = document.getElementById('modalVideoFrame');
	const modalClose = modal.querySelector('.modal-close');
	const modalOverlay = modal.querySelector('.modal-overlay');
	const videoItems = document.querySelectorAll('.video-item');

	// Função para abrir modal
	function openModal(videoUrl, videoTitle) {
		// Converte URL para formato embed se necessário
		const embedUrl = videoUrl.includes('embed') ? videoUrl : videoUrl.replace('watch?v=', 'embed/');
		
		modalFrame.src = embedUrl + '?autoplay=1';
		modalFrame.title = videoTitle;
		modal.classList.add('active');
		modal.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden'; // Impede scroll da página
		
		// Foca no botão de fechar para acessibilidade
		modalClose.focus();
	}

	// Função para fechar modal
	function closeModal() {
		modalFrame.src = '';
		modal.classList.remove('active');
		modal.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = ''; // Restaura scroll da página
	}

	// Event listeners para os itens de vídeo
	videoItems.forEach(item => {
		item.addEventListener('click', () => {
			const videoUrl = item.dataset.videoUrl;
			const videoTitle = item.dataset.videoTitle;
			openModal(videoUrl, videoTitle);
		});

		// Suporte para navegação por teclado
		item.addEventListener('keypress', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				const videoUrl = item.dataset.videoUrl;
				const videoTitle = item.dataset.videoTitle;
				openModal(videoUrl, videoTitle);
			}
		});

		// Torna o item focável
		item.setAttribute('tabindex', '0');
		item.setAttribute('role', 'button');
		item.setAttribute('aria-label', `Reproduzir vídeo: ${item.dataset.videoTitle}`);
	});

	// Event listeners para fechar modal
	modalClose.addEventListener('click', closeModal);
	modalOverlay.addEventListener('click', closeModal);

	// Fechar com ESC
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal.classList.contains('active')) {
			closeModal();
		}
	});
}
