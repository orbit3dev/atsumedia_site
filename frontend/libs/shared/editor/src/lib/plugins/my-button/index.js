import './index.scss';
import notifier from 'codex-notifier';

export default class AnyButton {
	/**
	 *
	 * @returns {{icon: string, title: string}}
	 */
	static get toolbox() {
		return {
			title: 'Button',
			icon: `<svg viewBox="0 0 1365 1024" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                    <path d="M422.4 734.776889c21.959111 0 42.325333-1.991111 61.098667-6.087111 18.773333-4.096 35.043556-11.605333 48.810666-22.641778 12.288-9.557333 22.471111-21.333333 30.663111-35.441778 12.8-21.162667 19.228444-45.112889 19.228445-71.793778 0-25.827556-5.575111-47.843556-16.782222-65.991111a96.540444 96.540444 0 0 0-49.720889-39.708444 102.968889 102.968889 0 0 0 32.654222-25.656889c13.255111-16.725333 19.854222-38.798222 19.854222-66.275556 0-26.737778-6.599111-49.607111-19.854222-68.778666-21.959111-31.175111-59.278222-47.160889-111.957333-47.957334H227.555556v450.332445h194.844444z m-3.527111-272.839111H313.287111V362.666667h94.492445c20.821333 0 37.944889 2.332444 51.313777 6.997333 15.587556 6.769778 23.324444 20.593778 23.324445 41.528889 0 19.000889-5.859556 32.199111-17.635556 39.594667-11.719111 7.452444-27.022222 11.150222-45.909333 11.150222z m0 194.616889H313.287111v-120.035556H420.408889c18.659556 0.170667 33.109333 2.730667 43.463111 7.623111 18.432 8.760889 27.704889 24.860444 27.704889 48.298667 0 27.704889-9.557333 46.421333-28.615111 56.206222-10.467556 5.290667-25.144889 7.964444-44.032 7.964445zM744.277333 739.555556l12.629334-0.170667 39.367111-1.536v-65.080889a215.779556 215.779556 0 0 1-16.327111 0.568889c-16.952889 0-27.022222-1.649778-30.321778-5.006222-3.356444-3.356444-5.006222-11.832889-5.006222-25.486223v-176.014222h51.655111v-62.008889h-51.655111V311.921778h-82.204445v92.899555h-44.373333v62.008889h44.373333v205.027556c0 20.764444 4.664889 36.124444 13.994667 46.08 14.392889 15.758222 41.187556 22.869333 80.497778 21.447111l-12.629334 0.170667z m188.757334-4.778667v-180.224c0-20.593778 2.730667-37.546667 8.192-50.744889 10.467556-25.031111 29.809778-37.546667 58.026666-37.546667 22.926222 0 38.513778 8.533333 46.648889 25.6 4.494222 9.386667 6.712889 22.869333 6.712889 40.391111v202.524445H1137.777778v-224.256c0-41.756444-10.467556-71.68-31.345778-89.656889-20.935111-18.033778-47.786667-27.022222-80.668444-27.022222-26.225778 0-47.900444 6.712889-65.024 20.138666-9.500444 7.566222-19.626667 19.911111-30.321778 36.977778v-48.583111h-80.213334v332.401778h82.830223z" fill="#000000"></path>
					</svg>`,
		};
	}

	static get tunes() {
		return [
			{
				name: 'edit_mode',
				icon: `<svg viewBox="0 0 1365 1024" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                    <path d="M422.4 734.776889c21.959111 0 42.325333-1.991111 61.098667-6.087111 18.773333-4.096 35.043556-11.605333 48.810666-22.641778 12.288-9.557333 22.471111-21.333333 30.663111-35.441778 12.8-21.162667 19.228444-45.112889 19.228445-71.793778 0-25.827556-5.575111-47.843556-16.782222-65.991111a96.540444 96.540444 0 0 0-49.720889-39.708444 102.968889 102.968889 0 0 0 32.654222-25.656889c13.255111-16.725333 19.854222-38.798222 19.854222-66.275556 0-26.737778-6.599111-49.607111-19.854222-68.778666-21.959111-31.175111-59.278222-47.160889-111.957333-47.957334H227.555556v450.332445h194.844444z m-3.527111-272.839111H313.287111V362.666667h94.492445c20.821333 0 37.944889 2.332444 51.313777 6.997333 15.587556 6.769778 23.324444 20.593778 23.324445 41.528889 0 19.000889-5.859556 32.199111-17.635556 39.594667-11.719111 7.452444-27.022222 11.150222-45.909333 11.150222z m0 194.616889H313.287111v-120.035556H420.408889c18.659556 0.170667 33.109333 2.730667 43.463111 7.623111 18.432 8.760889 27.704889 24.860444 27.704889 48.298667 0 27.704889-9.557333 46.421333-28.615111 56.206222-10.467556 5.290667-25.144889 7.964444-44.032 7.964445zM744.277333 739.555556l12.629334-0.170667 39.367111-1.536v-65.080889a215.779556 215.779556 0 0 1-16.327111 0.568889c-16.952889 0-27.022222-1.649778-30.321778-5.006222-3.356444-3.356444-5.006222-11.832889-5.006222-25.486223v-176.014222h51.655111v-62.008889h-51.655111V311.921778h-82.204445v92.899555h-44.373333v62.008889h44.373333v205.027556c0 20.764444 4.664889 36.124444 13.994667 46.08 14.392889 15.758222 41.187556 22.869333 80.497778 21.447111l-12.629334 0.170667z m188.757334-4.778667v-180.224c0-20.593778 2.730667-37.546667 8.192-50.744889 10.467556-25.031111 29.809778-37.546667 58.026666-37.546667 22.926222 0 38.513778 8.533333 46.648889 25.6 4.494222 9.386667 6.712889 22.869333 6.712889 40.391111v202.524445H1137.777778v-224.256c0-41.756444-10.467556-71.68-31.345778-89.656889-20.935111-18.033778-47.786667-27.022222-80.668444-27.022222-26.225778 0-47.900444 6.712889-65.024 20.138666-9.500444 7.566222-19.626667 19.911111-30.321778 36.977778v-48.583111h-80.213334v332.401778h82.830223z" fill="#000000"></path>
					</svg>`,
				title: 'ボタンを編集',
			},
		];
	}

	renderSettings() {
		const tunes = AnyButton.tunes;

		return tunes.map((tune) => ({
			icon: tune.icon,
			label: this.api.i18n.t(tune.title),
			name: tune.name,
			onActivate: () => {
				this.data = {
					link: this.nodes.linkInput.textContent,
					text: this.nodes.textInput.textContent,
					title: this.nodes.titleInput.textContent,
				};
				this.show(Number(AnyButton.STATE.EDIT));
			},
		}));
	}

	/**
	 * Returns true to notify the core that read-only mode is supported
	 *
	 * @return {boolean}
	 */
	static get isReadOnlySupported() {
		return true;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	static get enableLineBreaks() {
		return false;
	}

	/**
	 *
	 * @returns {{EDIT: number, VIEW: number}}
	 * @constructor
	 */
	static get STATE() {
		return {
			EDIT: 0,
			VIEW: 1,
		};
	}

	/**
	 *
	 * @param data
	 */
	set data(data) {
		this._data = Object.assign(
			{},
			{
				link: this.api.sanitizer.clean(data.link || '', AnyButton.sanitize),
				text: this.api.sanitizer.clean(data.text || '', AnyButton.sanitize),
				title: this.api.sanitizer.clean(`\\ ${data.title} /` || '', AnyButton.sanitize),
			}
		);
	}

	/**
	 *
	 * @returns {{text: string, link: string}}
	 */
	get data() {
		return this._data;
	}

	/**
	 * セーブ時のバリデーション
	 * @returns {boolean}
	 */
	validate() {
		if (this._data.link === '' || this._data.text === '' || this._data.title === '') {
			return false;
		}
		return true;
	}

	/**
	 *
	 * @returns {{caption: string, text: string, alignment: string}}
	 */
	save() {
		return this._data;
	}

	/**
	 * タグを全部削除する
	 * @returns {{link: boolean, text: boolean}}
	 */
	static get sanitize() {
		return {
			text: false,
			link: false,
			title: false,
		};
	}

	defaultLinkValidation(text) {
		//全ての文字列が渡されるがURLのみ許可する. URLじゃない文字列も考慮する
		// let url = null;
		// try {
		//     url = new URL(text);
		// } catch (e) {
		//     notifier.show({
		//         message: "URLが間違っています",
		//         style: 'error'
		//     })
		//     return false;
		// }
		// //httpsかhttpが入っていなければエラー
		// if (url.protocol !== "https:" && url.protocol !== "http:") {
		//     notifier.show({
		//         message: "正しいURLを入力してください",
		//         style: 'error'
		//     })
		//     return false;
		// }
		return true;
	}

	defaultTextValidation(text) {
		if (text === '') {
			notifier.show({
				message: 'ボタンのテキストを入力してください',
				style: 'error',
			});
			return false;
		}
		return true;
	}

	/**
	 *
	 * @param data
	 * @param config
	 * @param api
	 * @param readOnly
	 */
	constructor({ data, config, api, readOnly }) {
		this.api = api;
		this.readOnly = readOnly;

		this.nodes = {
			wrapper: null,
			container: null,
			inputHolder: null,
			toggleHolder: null,
			anyButtonHolder: null,
			textInput: null,
			titleInput: null,
			linkInput: null,
			registButton: null,
			anyButton: null,
			anyTitle: null,
		};
		//css overwrite
		const _CSS = {
			baseClass: this.api.styles.block,
			hide: 'hide',
			btn: 'anyButton__btn',
			title: 'anyButton__title',
			container: 'anyButtonContainer',
			input: 'anyButtonContainer__input',

			inputHolder: 'anyButtonContainer__inputHolder',
			inputText: 'anyButtonContainer__input--text',
			inputLink: 'anyButtonContainer__input--link',
			registButton: 'anyButtonContainer__registerButton',
			anyButtonHolder: 'anyButtonContainer__anyButtonHolder',
			btnColor: 'anyButton__btn--default',
		};

		this.CSS = Object.assign(_CSS, config.css);
		this.linkValidation = config.linkValidation || this.defaultLinkValidation.bind(this);
		this.textValidation = config.textValidation || this.defaultTextValidation.bind(this);

		this.data = {
			link: '',
			text: '',
			title: '',
		};
		this.data = data;
	}

	render() {
		this.nodes.wrapper = this.make('div', this.CSS.baseClass);
		this.nodes.container = this.make('div', this.CSS.container); //twitter-embed-tool

		//入力用
		this.nodes.inputHolder = this.makeInputHolder();
    this.nodes.linkInput.textContent = 'https://';
		//display button
		this.nodes.anyButtonHolder = this.makeAnyButtonHolder();

		this.nodes.container.appendChild(this.nodes.inputHolder);
		// this.nodes.container.appendChild(this.nodes.anyButtonHolder);

		if (this._data.link !== '') {
			this.init();
			this.show(AnyButton.STATE.VIEW);
		}

		this.nodes.wrapper.appendChild(this.nodes.container);

		return this.nodes.wrapper;
	}

	makeInputHolder() {
		const inputHolder = this.make('div', [this.CSS.inputHolder]);
		this.nodes.titleInput = this.make('div', [this.api.styles.input, this.CSS.input, this.CSS.inputText], {
			contentEditable: !this.readOnly,
		});
		this.nodes.titleInput.dataset.placeholder = this.api.i18n.t('Title Text');

		this.nodes.textInput = this.make('div', [this.api.styles.input, this.CSS.input, this.CSS.inputText], {
			contentEditable: !this.readOnly,
		});
		this.nodes.textInput.dataset.placeholder = this.api.i18n.t('Button Text');

		this.nodes.linkInput = this.make('div', [this.api.styles.input, this.CSS.input, this.CSS.inputLink], {
			contentEditable: !this.readOnly,
		});
		this.nodes.linkInput.dataset.placeholder = this.api.i18n.t('Link Url');

		this.nodes.registButton = this.make('button', [this.api.styles.button, this.CSS.registButton]);
		this.nodes.registButton.type = 'button';
		this.nodes.registButton.textContent = this.api.i18n.t('Set');

		this.nodes.registButton.addEventListener('click', () => {
			if (!this.linkValidation(this.nodes.linkInput.textContent)) {
				return;
			}
			if (!this.textValidation(this.nodes.textInput.textContent)) {
				return;
			}
			if (!this.textValidation(this.nodes.titleInput.textContent)) {
				return;
			}
			this.data = {
				link: this.nodes.linkInput.textContent,
				text: this.nodes.textInput.textContent,
				title: this.nodes.titleInput.textContent,
			};
			this.show(AnyButton.STATE.VIEW);
		});

		inputHolder.appendChild(this.nodes.titleInput);
		inputHolder.appendChild(this.nodes.textInput);
		inputHolder.appendChild(this.nodes.linkInput);
		inputHolder.appendChild(this.nodes.registButton);

		return inputHolder;
	}

	init() {
		this.nodes.titleInput.textContent = this._data.title;
		this.nodes.textInput.textContent = this._data.text;
		this.nodes.linkInput.textContent = this._data.link;
	}

	show(state) {
		this.nodes.anyButton.textContent = this._data.text;
		this.nodes.anyTitle.textContent = this._data.title;
		this.nodes.anyButton.setAttribute('href', this._data.link);
		this.changeState(state);
	}

	makeAnyButtonHolder() {
		// const anyButtonHolder = this.make('div', [this.CSS.hide, this.CSS.anyButtonHolder]);
		const anyButtonHolder = this.make('div', [this.CSS.anyButtonHolder]);
		this.nodes.anyTitle = this.make('div', [this.CSS.title]);
		this.nodes.anyButton = this.make('a', [this.CSS.btn, this.CSS.btnColor], {
			target: '_blank',
			rel: 'nofollow noindex noreferrer',
		});
		this.nodes.anyButton.textContent = this.api.i18n.t('Default Button');
		anyButtonHolder.appendChild(this.nodes.anyTitle);
		anyButtonHolder.appendChild(this.nodes.anyButton);
		return anyButtonHolder;
	}

	changeState(state) {
		switch (state) {
			case AnyButton.STATE.EDIT:
				// this.nodes.inputHolder.classList.remove(this.CSS.hide);
				// this.nodes.anyButtonHolder.classList.add(this.CSS.hide);
				this.nodes.container.appendChild(this.nodes.inputHolder);
				this.nodes.container.removeChild(this.nodes.anyButtonHolder);
				break;
			case AnyButton.STATE.VIEW:
				this.nodes.container.removeChild(this.nodes.inputHolder);
				this.nodes.container.appendChild(this.nodes.anyButtonHolder);
				// this.nodes.inputHolder.classList.add(this.CSS.hide);
				// this.nodes.anyButtonHolder.classList.remove(this.CSS.hide);
				break;
		}
	}

	/**
	 * node 作成用
	 * @param tagName
	 * @param classNames
	 * @param attributes
	 * @returns {*}
	 */
	make(tagName, classNames = null, attributes = {}) {
		const el = document.createElement(tagName);

		if (Array.isArray(classNames)) {
			el.classList.add(...classNames);
		} else if (classNames) {
			el.classList.add(classNames);
		}

		for (const attrName in attributes) {
			el[attrName] = attributes[attrName];
		}

		return el;
	}
}
