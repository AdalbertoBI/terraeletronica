// JS específico da página 404

document.addEventListener('DOMContentLoaded', function() {
    // Contador para redirecionamento automático
    let countdown = 5; // 5 segundos
    const countdownElement = document.getElementById('countdown');
    
    // Função para atualizar o contador
    function updateCountdown() {
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        countdown--;
        
        if (countdown < 0) {
            // Redireciona para a página inicial
            window.location.href = 'index.html';
        }
    }
    
    // Inicia o contador se o elemento existir
    if (countdownElement) {
        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        
        // Para o timer se o usuário clicar em qualquer link
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                clearInterval(timer);
            }
        });
        
        // Fallback adicional: se por algum motivo o timer falhar, redireciona após 8 segundos
        setTimeout(function() {
            if (window.location.pathname.includes('404')) {
                window.location.href = 'index.html';
            }
        }, 8000);
    } else {
        // Se não encontrar o elemento countdown, redireciona após 5 segundos
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 5000);
    }
    
    // Redirecionamento imediato para URLs específicas conhecidas
    const currentPath = window.location.pathname.toLowerCase();
    const redirectMap = {
        // Mapeamento de URLs antigas para novas (adicione conforme necessário)
        '/produtos.html': 'index.html#produtos',
        '/sobre.html': 'index.html#sobre',
        '/contato.html': 'index.html#contato',
        '/catalogo.html': 'produtos/instrumentos-midi.html',
        '/manual.html': 'manuais.html',
        '/download.html': 'downloads.html'
    };
    
    // Verifica se a URL atual tem um redirecionamento específico
    for (const [oldPath, newPath] of Object.entries(redirectMap)) {
        if (currentPath.includes(oldPath.toLowerCase())) {
            window.location.href = newPath;
            return;
        }
    }
});
