/** Class representing generalized Form validator. */
class FormValidator {
    /**
     * Validates required text inputs
     * @param {NodeListOf<Element>} elements
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static textInputs(elements) {
        const invalidElements = [];
        elements.forEach(el => {
            if (el.value == null)
                invalidElements.push(el);
            else if (el.value.trim() === '')
                invalidElements.push(el);
        });
        return invalidElements;
    }

    /**
     * Text inputs include text and textarea elements
     * @param {NodeListOf<Element>} elements
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static textInputsWithoutSpace(elements) {
        const invalidElements = [];
        elements.forEach(el => {
            if (el.value == null)
                invalidElements.push(el);
            else if (el.value.trim().indexOf(' ') >= 0)
                invalidElements.push(el);
            else if (el.value.trim() === '')
                invalidElements.push(el);
        });
        return invalidElements;
    }

    /**
     * The first radio button MUST contain id for the radio button group label
     * @param {NodeListOf<Element>} rbgroup
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static radioButtonGroup(rbgroup) {
        return Array.from(rbgroup).some(rb => rb.checked) ? [] : [rbgroup[0]];
    }

    /**
     * Validates datetime elements
     * @param {NodeListOf<Element>} elements
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static dateTimeLocals(elements) {
        const invalidElements = [];
        elements.forEach(el => {
            if (el.value.trim() === '')
                invalidElements.push(el);
        });
        return invalidElements;
    }

    /**
     * Validates select element with defined minimum selected items (default=1)
     * @param {HTMLSelectElement} element
     * @param {number} minSelectedItems
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static select(element, minSelectedItems = 1) {
        return Array.from(element.querySelectorAll('option'))
            .filter(el => el.selected && el.value != -1).length < minSelectedItems ? [element] : []
    }

    /**
     * Validates checkbox group with defined minimum checked items (default=1)
     * @param {NodeListOf<Element>} chcboxGroup
     * @param {number} minSelectedItems
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static checkboxGroup(chcboxGroup, minSelectedItems = 1) {
        return Array.from(chcboxGroup)
            .filter(el => el.checked).length < minSelectedItems ? [chcboxGroup[0]] : [];
    }

    /**
     * Validates file input for a given list of valid file extensions
     * @param {Element} element
     * @param {string[]} extensions
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static file(element, extensions) {
        if (!element.files.length)
            return [element];
        return extensions.includes(element.files[0].name.split('.').pop()) ? [] : [element];
    }

    /**
     * Validates number inputs within given range [minValue, maxValue]
     * @param {NodeListOf<Element>} elements
     * @param {number} minValue
     * @param {number} maxValue
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static numbers(elements, minValue = 0, maxValue = 100) {
        const invalidElements = [];
        elements.forEach(el => {
            if (el == null) {
                invalidElements.push(el);
                return;
            }
            if (el.value < minValue || el.value > maxValue || el.value.trim() === '')
                invalidElements.push(el);
        });
        return invalidElements;
    }

    /**
     * Validates that inputs with placeholders are of type 'text'
     * @param {NodeListOf<Element>} elements
     * @returns {Array} Elements that do not pass the validation
     * @static
     */
    static placeholders(elements) {
        const invalidElements = [];
        elements.forEach(el => {
            if (el.type !== 'text')
                invalidElements.push(el);
        });
        return invalidElements;
    }

    /**
     * Extracts get parameters from url
     * @param {string} url
     * @returns {JSON} containing key, value pairs of url query parameters
     */
    static urlGetParameters(url) {
        let queryParams = {};
        let params = url.split('?');
        if (params.length === 2)
            for (const param of params[1].split('&'))
                queryParams[`'${param.split('=')[0]}'`] = `${param.split('=')[1]}`;
        return queryParams;
    }
}

/** Class representing common JavaScrip animations. */
class Animation {
    static spin(element) {
        let spinner = null;
        element.addEventListener('mouseenter', () => {
            let degrees = 0
            spinner = setInterval(() =>
                    degrees === 360 ? degrees = 0 : element.style.transform = `rotate(${++degrees}deg)`,
                10);
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = `rotate(0deg)`;
            clearInterval(spinner);
        });
    }

    static zoom(element) {
        let inout = null;
        element.addEventListener('click', () => {
            let zoom = 1;
            inout = setInterval(() => element.style.zoom = (zoom -= 0.02), 10);
            setTimeout(() => {
                element.style.zoom = 0.5;
                clearInterval(inout);
                inout = setInterval(() => element.style.zoom = (zoom += 0.02), 10);
                setTimeout(() => {
                    element.style.zoom = 1.5;
                    clearInterval(inout);
                    inout = setInterval(() => element.style.zoom = (zoom -= 0.02), 10);
                    setTimeout(() => {
                        element.style.zoom = 'normal';
                        clearInterval(inout);
                    }, 250);
                }, 500);
            }, 250);
        });
    }

    static type(element, speed) {
        element.textContent = '|';
        let iter = 0;
        const typist = setInterval(() =>
                iter < pageTitle.length ?
                    element.textContent = `${element.textContent.substring(0, element.textContent.length - 1)}${pageTitle.charAt(iter++)}|`
                    : clearInterval(typist)
            , speed);
        setTimeout(() => {
            element.textContent = pageTitle;
        }, speed * pageTitle.length + 50);
    }
}

/** Class representing single cookie. */
class Cookie {
    /**
     * Creates cookie with a given name
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
        this.re = new RegExp(`${this.name}=([\\d\\w\/,'"{}#-: ]*)`, 'g');
    }

    /**
     * Updates cookie by setting its value and max-age or expires date
     * @param {string} value
     * @param {number} age
     * @param {number} expires
     */
    set(value, age = undefined, expires = undefined) {
        age !== undefined ?
            document.cookie = `${this.name}=${value};max-age=${age};path=/;domain=${window.location.hostname};` :
            document.cookie = `${this.name}=${value};path=/;domain=${window.location.hostname};expires=${new Date(expires).toUTCString()};`;
    };

    /**
     * Fetches cookie value
     * @returns cookie value
     */
    getValue() {
        let val = (this.re.exec(document.cookie))[1];
        this.re.lastIndex = 0;
        return val;
    }

    /**
     * Removes cookie
     */
    remove = () => document.cookie = `${this.name}=;max-age=0;path=/;domain=${window.location.hostname}`;

    /**
     * Checks if cookie exists
     * @returns true if cookie exists, else false
     */
    exists = () => new RegExp(`${this.name}=`, 'g').test(document.cookie);
}

/** Class representing authorization cookie. */
class AuthCookie extends Cookie {
    /**
     * Initializes authorization cookie
     * @param {string} name - cookie name
     */
    constructor(name) {
        super(name);
        this.re = new RegExp(`${this.name}=([\\d\\w]+) ([\\d\\w]+) (\\d+)`, 'g');
    }

    /**
     * Creates authorization cookie for a given user and password, lasting [aeg] seconds
     * @param {string} user
     * @param {string} password
     * @param {number} age - cookie max-age
     */
    setAuthorization(user, password, age) {
        super.set(`${user} ${password} ${Date.now() + age * 1000}`, age);
    }

    /**
     * Fetches cookie's user
     * @returns {string} - user
     */
    getUser() {
        let user = (this.re.exec(document.cookie))[1];
        this.re.lastIndex = 0;
        return user;
    }

    /**
     * Fetches cookie's expiration aate
     * @returns {number} - expiration date in milliseconds
     */
    getExpiration() {
        let expiration = (this.re.exec(document.cookie))[3];
        this.re.lastIndex = 0;
        return parseInt(expiration);
    }
}

/** Class representing design cookie. */
class DesignCookie extends Cookie {
    /**
     * Initializes design cookie
     * @param {string} name - cookie name
     */
    constructor(name) {
        super(name);
    }

    /**
     * Creates design cookie with given design object
     * @param {object} design
     * @param {number} age - optional, defaults to Authorization cookie expiration
     */
    setDesign(design, age) {
        age === undefined ? super.set(JSON.stringify(design), undefined, authCookie.getExpiration())
            : super.set(JSON.stringify(design), age)
    }

    /**
     * Fetches design cookie in JSON
     * @returns {object} design object
     */
    getDesign = () => JSON.parse(this.getValue());
}

// supported image file extensions
const imgExtensions = ['png', 'jpg', 'jpeg'];
const pageTitle = document.title;

// cookies
const authCookie = new AuthCookie('userCredentials');
const designCookie = new DesignCookie('customDesign');

const defaultDesign = {
    "primaryColor": "#F5D0C5",
    "secondaryColor": "#D69F7E",
    "titleSize": 42,
    "textTransform": "none",
    "opacity": 100
};

// english to croatian translation of needed terms
const dictionary = {
    'poly': 'Višekut', 'circle': 'Krug', 'rect': 'Pravokutnik'
};

function enableAuthorization() {
    if (window.location.href.endsWith('/login'))
        return;

    setInterval(() => {
        if (!authCookie.exists())
            window.location.href = `${window.location.protocol}//${window.location.host}/login`;
    }, 50);

    document.querySelectorAll('a[href="/logout"]').forEach(link =>
        link.addEventListener('click', () => {
            authCookie.remove();
            designCookie.remove();
        })
    );

    const msgHello = document.getElementById('hello');
    const msgGoodbye = document.getElementById('goodbye');
    msgHello.textContent = msgHello.textContent
        .replace('{}', authCookie.getUser());
    msgGoodbye.textContent = msgGoodbye.textContent
        .replace('{}', new Date(authCookie.getExpiration()).toLocaleString());
}

function initLoginForm() {
    const frmLogin = document.getElementById('login');

    frmLogin?.addEventListener('submit', e => {
        // resets errors
        frmLogin.querySelectorAll('label').forEach(el => el.classList.remove('lbl-error'));

        // validates form
        let errs = FormValidator.textInputsWithoutSpace(frmLogin.querySelectorAll('input[type="text"], input[type="password"]'))
            .concat(FormValidator.numbers(frmLogin.querySelectorAll('input[type="number"]'), 0, 86400));

        if (errs.length) {
            // marks error labels
            errs.filter(el => el !== undefined && el != null)
                .map(el => frmLogin.querySelector(`label[for="${el.id}"]`))
                .forEach(el => el.classList.add('lbl-error'));

            e.preventDefault();
            return;
        }

        const username = frmLogin.querySelector('#username').value;
        const password = frmLogin.querySelector('#password').value;
        const cookieAge = frmLogin.querySelector('#cookie-age').value;

        authCookie.setAuthorization(username, password, cookieAge);
        designCookie.setDesign(defaultDesign, cookieAge);
    });
}

function initNavigationLinks() {
    document.querySelectorAll('nav a').forEach(link =>
        link.addEventListener('click', e => {
            if (!confirm('Napustiti stranicu?')) {
                alert(`Ostajemo na stranici: ${pageTitle}`);
                e.preventDefault();
            }
        }));
}

function initForm() {
    const musicForm = document.getElementById('musicForm');
    if (!musicForm) return;

    // all form fieldsets
    const firstFieldset = musicForm.firstElementChild;
    const secondFieldset = firstFieldset.nextElementSibling;
    // all labels
    const firstLabels = firstFieldset.querySelectorAll('label');
    const secondLabels = secondFieldset.querySelectorAll('label');
    // submit button
    const btnSubmit = musicForm.querySelector('input[type="submit"]');
    // displays range input value
    const inPriceRange = secondFieldset.querySelector('input[type="range"]');
    inPriceRange.addEventListener('input', () =>
        inPriceRange.nextElementSibling.innerHTML = `${inPriceRange.value}&euro;`
    );

    musicForm.addEventListener('submit', e => {
        // resets first fieldset errors
        firstLabels.forEach(el => el.classList.remove('lbl-error'));

        // validates first fieldset
        let errs = FormValidator.placeholders(firstFieldset.querySelectorAll('input[placeholder]'))
            .concat(FormValidator.textInputs(firstFieldset.querySelectorAll('input[type="text"], input[type="url"], textarea')))
            .concat(FormValidator.radioButtonGroup(firstFieldset.querySelectorAll('input[name="musicType"]')))
            .concat(FormValidator.dateTimeLocals(firstFieldset.querySelectorAll('input[type="datetime-local"]')))
            .concat(FormValidator.select(firstFieldset.querySelector('select'), 2))
            .concat(FormValidator.checkboxGroup(firstFieldset.querySelectorAll('input[name="lang[]"]'), 2))
            .concat(FormValidator.file(firstFieldset.querySelector('input[type="file"]'), imgExtensions));

        const websiteURL = firstFieldset.querySelector('input[type="url"]');
        const queryParams = FormValidator.urlGetParameters(websiteURL.value);
        if (Object.values(queryParams).length !== 0) {
            errs = errs.concat(websiteURL);

            let alertValue = '';
            for (const queryParamsKey in queryParams)
                alertValue += `GET parameter ${queryParamsKey} i vrijednost '${queryParams[queryParamsKey]}' nije dozvoljen na ovoj stranici\n`;
            alert(alertValue);
        }

        const releaseDateTime = document.getElementById('releaseDateTime');
        if (!/[0-3]\d\.[0-1]\d\.\d{4}. [0-2]\d:[0-5]\d:[0-5]\d/.test(releaseDateTime.value))
            errs = errs.concat(releaseDateTime);

        const songs = document.getElementById('songs');
        if (/^[\S\s]{0,99}$|^[\S\s]{1001,}$|['"<>]|\.\./.test(songs.value))
            errs = errs.concat(songs);

        if (errs.length) {
            // marks error labels
            errs.filter(el => el !== undefined && el != null)
                .map(el => firstFieldset.querySelector(`label[for="${el.id}"]`))
                .forEach(el => el.classList.add('lbl-error'));

            // hides second fieldset
            secondFieldset.style.visibility = 'hidden';
            btnSubmit.value = 'Dalje';

            // disables submitting form
            e.preventDefault();
            return;
        }

        // validates second fieldset if it is visible
        if (secondFieldset.style.visibility === 'visible') {
            // resets second fieldset errors
            secondLabels.forEach(el => el.classList.remove('lbl-error'));
            // validates second fieldset
            const rating = secondFieldset.querySelector('input[type="number"]');
            if (rating.value.trim() !== '') {
                if (/^-|^10[1-9]|^1[1-9]\\d|^\\d{4,}/.test(rating.value))
                    errs = [rating];
            } else
                errs = [rating];

            if (errs.length) {
                // marks error labels
                errs.filter(el => el !== undefined && el != null)
                    .map(el => secondFieldset.querySelector(`label[for="${el.id}"]`))
                    .forEach(el => el.classList.add('lbl-error'));

                // disables submitting form
                e.preventDefault();
            }
        } else {
            secondFieldset.style.visibility = 'visible';
            btnSubmit.value = 'Pošalji';
            e.preventDefault();
        }
    });

    musicForm.addEventListener('reset', () => {
        Array.from(firstLabels).concat(Array.from(secondLabels))
            .forEach(el => el.classList.remove('lbl-error'));
        secondFieldset.style.visibility = 'hidden';
        btnSubmit.value = 'Dalje';
    });
}

function initAnimations() {
    const title = document.querySelector('h1');
    Animation.spin(document.querySelector('[href="#header"]'));
    Animation.zoom(title);
    Animation.type(title, 70);
}

function allowEdits() {
    document.getElementById('edit')?.addEventListener('click', () => {
        let url = `${window.location.protocol}//${window.location.host}/other/design`;
        let width = 900;
        let height = 650;
        let left = (screen.availWidth / 2) - (width / 2);
        let top = (screen.availHeight / 2) - (height / 2);
        let windowFeatures = `width=${width},height=${height},status,resizable,left=${left},top=${top},screenX=${left},screenY=${top}`;
        window.open(url, '_blank', windowFeatures);
    });

    if (designCookie.exists()) {
        const design = designCookie.getDesign();
        document.documentElement.style.setProperty('--primary', design.primaryColor);
        document.documentElement.style.setProperty('--secondary', design.secondaryColor);
        document.querySelector('header > h1').style.fontSize = `${design.titleSize}px`;
        document.body.style.textTransform = design.textTransform;
        document.body.style.opacity = `${design.opacity}%`;
    }
}

function initEditForm() {
    const frmEdit = document.getElementById('frmEdit');

    frmEdit?.addEventListener('submit', e => {
        e.preventDefault();
        // resets errors
        frmEdit.querySelectorAll('label').forEach(el => el.classList.remove('lbl-error'));

        // validates form
        const textTransformations = frmEdit.querySelectorAll('input[name="text-transformation"]');

        let errs = FormValidator.numbers(frmEdit.querySelectorAll('#font-size'), 5, 50)
            .concat(FormValidator.radioButtonGroup(textTransformations))
            .concat(FormValidator.numbers(frmEdit.querySelectorAll('#opacity')));

        if (errs.length) {
            // marks error labels
            errs.filter(el => el !== undefined && el != null)
                .map(el => frmEdit.querySelector(`label[for="${el.id}"]`))
                .forEach(el => el.classList.add('lbl-error'));
            return;
        }

        const primaryColor = frmEdit.querySelector('#primary-color').value;
        const secondaryColor = frmEdit.querySelector('#secondary-color').value;
        const titleSize = frmEdit.querySelector('#title-size').value;
        const textTransform = Array.from(textTransformations).filter(rb => rb.checked)[0].value;
        const opacity = frmEdit.querySelector('#opacity').value;

        designCookie.setDesign({
            "primaryColor": primaryColor,
            "secondaryColor": secondaryColor,
            "titleSize": titleSize,
            "textTransform": textTransform,
            "opacity": opacity
        });
        window.opener.location.reload();
        window.close();
    });

    frmEdit?.addEventListener('reset', e => {
        e.preventDefault();
        designCookie.setDesign(defaultDesign);
        window.opener.location.reload();
        window.close();
    });
}

function displayStatistics() {
    const frmStats = document.getElementById('frmStats');
    if (!frmStats)
        return;

    const canvas = document.getElementById('statisticsTemplate').content.querySelector('#mainCanvas');

    const userCanvas = document.createElement('canvas');
    userCanvas.classList.add('hidden');
    userCanvas.classList.add('mb-3');
    userCanvas.width = canvas.width;
    userCanvas.height = canvas.height;

    const barTopPadding = 10;
    const barMargin = 10;
    const usrCtx = userCanvas.getContext('2d');
    usrCtx.lineWidth = 5;
    usrCtx.font = '11pt -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
    usrCtx.textBaseline = 'middle';

    document.querySelector('main').append(userCanvas);

    const frequencies = new Map();

    frmStats.addEventListener('submit', e => {
        e.preventDefault();
        // resets errors
        frmStats.querySelectorAll('label').forEach(el => el.classList.remove('lbl-error'));

        // validates form
        let errs = FormValidator.textInputs(frmStats.querySelectorAll('input[type="text"]'))
            .concat(FormValidator.numbers(frmStats.querySelectorAll('input[type="number"]')));

        if (errs.length) {
            // marks error labels
            errs.filter(el => el !== undefined && el != null)
                .map(el => frmStats.querySelector(`label[for="${el.id}"]`))
                .forEach(el => el.classList.add('lbl-error'));
            return;
        }

        // stores new data
        const name = frmStats.querySelector('#name').value.toLowerCase();
        const value = parseInt(frmStats.querySelector('#value').value);
        frequencies.has(name) ? frequencies.set(name, frequencies.get(name) + value) : frequencies.set(name, value);

        // clears previous drawings
        userCanvas.classList.remove('hidden');
        usrCtx.clearRect(0, 0, userCanvas.width, userCanvas.height);

        // calculates bars' info
        const frqCount = frequencies.size;
        const barWidth = (canvas.width - (frqCount + 1) * barMargin) / frqCount;
        const barHeightMax = Math.max(...frequencies.values());
        let bars = 1;

        // draws bar with text in them
        frequencies.forEach((val, key) => {
            // calculates bars' info
            const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            const topPadding = canvas.height - val / barHeightMax * canvas.height + barTopPadding;
            const leftPadding = barMargin * bars + (bars - 1) * barWidth;

            // bar
            usrCtx.fillStyle = color;
            usrCtx.fillRect(
                leftPadding,
                topPadding,
                barWidth,
                canvas.height
            );

            // gets inverse color
            const r = parseInt(color.slice(1, 3), 16),
                g = parseInt(color.slice(3, 5), 16),
                b = parseInt(color.slice(5, 7), 16);
            usrCtx.fillStyle = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';

            // bar description
            usrCtx.rotate(-Math.PI / 2);
            usrCtx.fillText(`${key} [${val}]`, -canvas.height + barTopPadding, bars * barMargin + (bars - 0.5) * barWidth);
            usrCtx.rotate(Math.PI / 2);
            bars++;
        });

        // adds border
        usrCtx.strokeRect(0, 0, canvas.width, canvas.height);

        // hides form
        frmStats.classList.add('hidden');
    });

    document.getElementById('btnShowForm').addEventListener('click', () =>
        frmStats.classList.remove('hidden')
    );
    document.getElementById('btnHideForm').addEventListener('click', e => {
        e.preventDefault();
        frmStats.classList.add('hidden');
    });
}

function initAreaDescription() {
    const areaDescription = document.getElementById('areaDescription');

    for (const area of document.getElementsByTagName('area')) {
        area.addEventListener('mouseover', () => {
            areaDescription.style.display = 'block';
            areaDescription.innerHTML = `${dictionary[area.shape]}:${formatAreaCoords(area)}.`;
        });
        area.addEventListener('mouseout', () => areaDescription.style.display = 'none')
    }
}

function formatAreaCoords(area) {
    const coords = area.coords.split(',');

    switch (area.shape) {
        case 'circle':
            return ` X<sub>1</sub>: ${coords[0]}, Y<sub>1</sub>: ${coords[1]}, R: ${coords[2]}`;
        case 'rect':
        case 'poly':
            return coords.map((value, index) =>
                index % 2 === 0 ? ` X<sub>${Math.trunc(index / 2) + 1}</sub>=${value}` :
                    ` Y<sub>${Math.trunc(index / 2) + 1}</sub>=${value}`);
        default:
            return 'Nemoguće identificirati oblik...';
    }
}

window.addEventListener('load', () => {
    enableAuthorization();
    initLoginForm();
    initNavigationLinks();
    initForm();
    initAnimations();
    allowEdits();
    initEditForm();
    displayStatistics();
    initAreaDescription();
});
