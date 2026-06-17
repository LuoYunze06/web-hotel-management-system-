(function () {
    const MAX_CHARS = 50;

    function isTextInput(input) {
        if (input.tagName === 'TEXTAREA') {
            return true;
        }

        if (input.tagName !== 'INPUT') {
            return false;
        }

        const type = (input.type || 'text').toLowerCase();
        return ['text', 'search', 'tel', 'email', 'password', 'url', 'number'].includes(type);
    }

    function getMaxChars(input) {
        const configuredMax = Number(input.getAttribute('data-max-chars'));
        return Number.isInteger(configuredMax) && configuredMax > 0 ? configuredMax : MAX_CHARS;
    }

    function addHint(input) {
        const hint = `max ${getMaxChars(input)} characters`;
        const current = input.getAttribute('placeholder') || '';

        if (!current) {
            input.setAttribute('placeholder', hint);
            return;
        }

        if (!current.includes(hint)) {
            input.setAttribute('placeholder', current + ' (' + hint + ')');
        }
    }

    function hasCharLimit(input) {
        return input.getAttribute('data-no-char-limit') !== 'true';
    }

    function shouldShowHint(input) {
        return document.body.getAttribute('data-hide-char-hint') !== 'true'
            && input.getAttribute('data-hide-char-hint') !== 'true';
    }

    function showInvalid(input) {
        input.setCustomValidity(`Please keep this field within ${getMaxChars(input)} characters.`);
        input.reportValidity();
    }

    function clearInvalid(input) {
        input.setCustomValidity('');
    }

    function limitInput(input) {
        input.addEventListener('keydown', function (event) {
            const allowedKeys = [
                'Backspace',
                'Delete',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Tab',
                'Home',
                'End'
            ];

            if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
                return;
            }

            if (input.value.length >= getMaxChars(input) && input.selectionStart === input.selectionEnd) {
                event.preventDefault();
                showInvalid(input);
            }
        });

        input.addEventListener('input', function () {
            const maxChars = getMaxChars(input);

            if (input.value.length > maxChars) {
                input.value = input.value.slice(0, maxChars);
            }

            clearInvalid(input);
        });
    }

    function validateInput(input) {
        if (!isTextInput(input) || !hasCharLimit(input)) {
            return true;
        }

        if (input.value.length > getMaxChars(input)) {
            showInvalid(input);
            input.focus();
            return false;
        }

        clearInvalid(input);
        return true;
    }

    function validateArea(area) {
        const inputs = area.querySelectorAll('input, textarea');

        for (const input of inputs) {
            if (!validateInput(input)) {
                return false;
            }
        }

        return true;
    }

    function getArea(button) {
        return button.closest('form, .form-wrap, .panel, .box, .container') || document.body;
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('input, textarea').forEach(function (input) {
            if (!isTextInput(input)) {
                return;
            }

            if (hasCharLimit(input)) {
                input.setAttribute('maxlength', String(getMaxChars(input)));
                if (shouldShowHint(input)) {
                    addHint(input);
                }
                limitInput(input);
            }
        });
    });

    document.addEventListener('submit', function (event) {
        if (!validateArea(event.target)) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);

    document.addEventListener('click', function (event) {
        const button = event.target.closest('button, input[type="submit"], input[type="button"]');

        if (!button) {
            return;
        }

        if (!validateArea(getArea(button))) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);
})();
