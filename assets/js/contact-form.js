// Validação e interatividade do formulário de contato
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contatoForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    const submitBtn = form.querySelector('.btn-send');
    const messageField = document.getElementById('mensagem');
    const charCounter = document.getElementById('char-count');
    
    // Configuração de validação
    const validators = {
        nome: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
            message: 'Digite um nome válido (apenas letras e espaços)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Digite um e-mail válido'
        },
        telefone: {
            required: false,
            pattern: /^[\(\)\d\s\-\+]+$/,
            message: 'Digite um telefone válido'
        },
        assunto: {
            required: true,
            message: 'Selecione um assunto'
        },
        mensagem: {
            required: true,
            minLength: 10,
            maxLength: 500,
            message: 'A mensagem deve ter entre 10 e 500 caracteres'
        }
    };

    // Função para validar campo individual
    function validateField(field) {
        const name = field.name;
        const value = field.value.trim();
        const validator = validators[name];
        const formGroup = field.closest('.form-group');
        const errorSpan = formGroup.querySelector('.form-error');
        
        let isValid = true;
        let errorMessage = '';

        // Validação obrigatória
        if (validator.required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        // Validação de comprimento mínimo
        else if (validator.minLength && value.length < validator.minLength) {
            isValid = false;
            errorMessage = `Mínimo ${validator.minLength} caracteres`;
        }
        // Validação de comprimento máximo
        else if (validator.maxLength && value.length > validator.maxLength) {
            isValid = false;
            errorMessage = `Máximo ${validator.maxLength} caracteres`;
        }
        // Validação de padrão
        else if (validator.pattern && value && !validator.pattern.test(value)) {
            isValid = false;
            errorMessage = validator.message;
        }

        // Aplicar classes de validação
        formGroup.classList.remove('valid', 'error');
        if (value) {
            formGroup.classList.add(isValid ? 'valid' : 'error');
        }

        // Mostrar/ocultar mensagem de erro
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
        }

        return isValid;
    }

    // Função para validar formulário completo
    function validateForm() {
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        // Atualizar estado do botão
        submitBtn.disabled = !isFormValid;
        submitBtn.classList.toggle('disabled', !isFormValid);

        return isFormValid;
    }

    // Event listeners para validação em tempo real
    inputs.forEach(input => {
        // Validação ao sair do campo
        input.addEventListener('blur', function() {
            validateField(this);
            validateForm();
        });

        // Validação durante digitação (com delay)
        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                validateField(this);
                validateForm();
            }, 300);
        });

        // Animação de foco
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.closest('.form-group').classList.remove('focused');
        });
    });

    // Contador de caracteres para textarea
    if (messageField && charCounter) {
        messageField.addEventListener('input', function() {
            const count = this.value.length;
            charCounter.textContent = count;
            
            // Mudar cor baseada no limite
            const counter = charCounter.parentElement;
            counter.classList.remove('warning', 'danger');
            
            if (count > 450) {
                counter.classList.add('danger');
            } else if (count > 400) {
                counter.classList.add('warning');
            }
        });
    }

    // Formatação automática do telefone
    const telefoneField = document.getElementById('telefone');
    if (telefoneField) {
        telefoneField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
                } else if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            this.value = value;
        });
    }

    // Função para mostrar feedback visual
    function showFeedback(type, message) {
        // Remover feedback anterior
        const existingFeedback = form.querySelector('.form-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Criar novo feedback
        const feedback = document.createElement('div');
        feedback.className = `form-feedback ${type}`;
        feedback.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;

        // Inserir no formulário
        form.appendChild(feedback);

        // Remover após 5 segundos
        setTimeout(() => {
            feedback.remove();
        }, 5000);
    }

    // Validação inicial
    validateForm();

    // CSS adicional para feedback
    const feedbackStyle = document.createElement('style');
    feedbackStyle.textContent = `
        .form-group.focused .form-label {
            color: var(--primary-color);
        }
        
        .character-counter.warning {
            color: var(--warning);
        }
        
        .character-counter.danger {
            color: var(--danger);
        }
        
        .form-feedback {
            padding: 1rem;
            border-radius: var(--radius-lg);
            margin-top: var(--spacing-lg);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-weight: 500;
            animation: slideDown 0.3s ease;
        }
        
        .form-feedback.success {
            background-color: rgba(40, 167, 69, 0.1);
            color: var(--success);
            border: 1px solid var(--success);
        }
        
        .form-feedback.error {
            background-color: rgba(220, 53, 69, 0.1);
            color: var(--danger);
            border: 1px solid var(--danger);
        }
        
        .btn-send.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
    `;
    
    document.head.appendChild(feedbackStyle);
});

// Função melhorada para envio via WhatsApp
function enviarWhatsApp() {
    const form = document.getElementById('contatoForm');
    const submitBtn = form.querySelector('.btn-send');
    
    // Validar formulário
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Verificar campos obrigatórios
    const requiredFields = ['nome', 'email', 'assunto', 'mensagem'];
    const missingFields = requiredFields.filter(field => !data[field]?.trim());
    
    if (missingFields.length > 0) {
        // Destacar campos obrigatórios
        missingFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.closest('.form-group').classList.add('error');
                field.focus();
            }
        });
        
        // Mostrar mensagem de erro
        showFeedback('error', 'Por favor, preencha todos os campos obrigatórios');
        return;
    }
    
    // Animação de carregamento
    submitBtn.classList.add('loading');
    
    // Simular delay de processamento
    setTimeout(() => {
        // Construir mensagem para WhatsApp
        const phoneNumber = '5512991653176';
        const message = `
*Nova mensagem do site Terra Eletrônica*

👤 *Nome:* ${data.nome}
📧 *E-mail:* ${data.email}
${data.telefone ? `📞 *Telefone:* ${data.telefone}` : ''}
🏷️ *Assunto:* ${data.assunto}

💬 *Mensagem:*
${data.mensagem}

---
_Enviado através do formulário de contato do site_
        `.trim();
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Remover carregamento
        submitBtn.classList.remove('loading');
        
        // Mostrar feedback de sucesso
        showFeedback('success', 'Mensagem preparada! Você será redirecionado para o WhatsApp.');
        
        // Limpar formulário após um tempo
        setTimeout(() => {
            form.reset();
            // Remover classes de validação
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('valid', 'error', 'focused');
            });
            // Resetar contador
            const charCounter = document.getElementById('char-count');
            if (charCounter) charCounter.textContent = '0';
        }, 2000);
        
    }, 1000);
}

function showFeedback(type, message) {
    const form = document.getElementById('contatoForm');
    
    // Remover feedback anterior
    const existingFeedback = form.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Criar novo feedback
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;

    // Inserir no formulário
    form.appendChild(feedback);

    // Remover após 5 segundos
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 5000);
}