import { Context } from 'fnd-core/cca-api';
import { CCAComponentImpl } from 'fnd-core/cca-impl';
import * as ko from 'knockout';
import * as $ from 'jquery';

import 'ojm/ojm-modelobject-manager';
import 'ojmui/ojm-table-datasource';
import 'ojs/ojknockout';
import 'promise';
import 'ojs/ojbutton';
import 'hcm-jet-composites/js/jet-composites/hcm-contextual-action/loader';

class FndMediaCardModel extends CCAComponentImpl {
	private unique: any;
	private element: any;
	private flipFlag: KnockoutObservable<string>;
	private pcaFlag: KnockoutObservable<boolean>;
	private cardWidth: KnockoutObservable<number>;
	private CARD_BACK: string;
	private selectedRecordId: KnockoutObservable<string>;
	private pcaPopupId: KnockoutObservable<string>;
	private labelContextualActions: string;
	private labelActionsMenu: string;
	private labelFlipCard: string;
	private labelImage: string;
	private cardSize: KnockoutObservable<string>;
	private cardHeight: KnockoutObservable<number>;
	private cardFlipFlag: KnockoutComputed<string>;
	private oj: any;
	private ojm: any;
	private msgBroker: any;
	private fnd: any;

	constructor(context: Context) {
		super(context);

		// The following needs to be replaced with with 'import'
		// call once Jet TS def is available
		// ---------------------------------------------------
		this.oj = require('ojs/ojcore');
		this.ojm = require('ojm/ojm-core');
		this.fnd = require('fnd-jet-lib/js/fndcore');
		this.msgBroker = require('ojm/ojm-jmbroker');
		this.element = context.element;
		this.unique = context.unique;
		this.flipFlag = ko.observable('front');
		this.pcaFlag = ko.observable(false);
		this.CARD_BACK = '#C_backSlot';
		this.cardWidth = ko.observable(270);
		this.selectedRecordId = ko.observable('');
		this.pcaPopupId = ko.observable('');
		this.labelContextualActions = 'CARD_CONTEXTUAL_ACTIONS';
		this.labelActionsMenu = 'CARD_ACTIONS_MENU';
		this.labelFlipCard = 'FLIP_CARD';
		this.labelImage = 'USER_IMAGE';
		this.cardSize = ko.observable('small');
		this.cardHeight = ko.observable(155);

		context.props.then((props: any) => {
			if (this.cardSize() === 'small') {
				this.cardHeight(155);
			} else if (this.cardSize() === 'medium') {
				this.cardHeight(245);
			} else if (this.cardSize() === 'large') {
				this.cardHeight(515);
			}

			if (props.size !== undefined) {
				this.cardSize(props.size);
			}

			setTimeout(
				() => {
					if ($('.ocaj-card-flipContainer') !== undefined) {
						let width: number = $('#C_card').width() - 41;
						this.cardWidth(width);
					} else {
						this.cardWidth(props.width - 41);
					}
				},
				0);

			let mediaQuery: any = this.oj.ResponsiveUtils.getFrameworkQuery(this.oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
			if (window.matchMedia(mediaQuery).matches) {
				this.pcaFlag(true);
			}

			/*
			* card flip flag
			*/
			this.cardFlipFlag = ko.computed({
				owner: this,
				read: () => {
					return this.flipFlag();
				}
			});

		});

	}

	/**
	 * @private
	 * Render PCA orange icon always in mobile view
	 * @return {boolean} returns pcaFlag render condition true or false
	 */
	public pcaFlagRendered = () => {
		let isMobile: boolean = false;
		let mediaQuery: any = this.oj.ResponsiveUtils.getFrameworkQuery(this.oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
		if (window.matchMedia(mediaQuery).matches) {
			isMobile = true;
		} else {
			isMobile = false;
		}
		return isMobile || this.pcaFlag();
	}

	/**
	 * @private 
	 * Close PCA popup
	 * @return {none}
	 */
	public closePCAPopupHandler = () => {
		let selector: any = $('#' + this.pcaPopupId());
		selector.ojPopup('close');
	}

	/*
	 * @private
	 * Card flip handler
	 * @param {object} model Model object
	 * @param {object} event Event object for the flip handler
	 * @return {none}
	 */
	public cardFlipHandler = (model: any, event: any) => {
		$(this.element.childNodes[0]).toggleClass('flipped');
		if (this.flipFlag() === 'front') {
			this.flipFlag('back');
		} else {
			this.flipFlag('front');
		}
	}

	/**
	 * @private
	 * Show PCA
	 * @returns {none}
	 */
	public showPCAHanlder = () => {
		this.pcaFlag(true);
	}

	/**
	 * @private
	 * Hide PCA
	 * @returns {none}
	 */
	public hidePCAHanlder = () => {
		this.pcaFlag(false);
	}

	/**
	 * @private
	 * Launches PCA popup with unified actions
	 * @param {string} pcaAlingId Align id for the popup
	 * @param {object} keyAttr Primary key value for the row clicked
	 * @returns {none}
	 */
	public launchCardPCAHanlder = (id: string, pcaAlingId: string, keyAttr: string) => {
		let popupId: string = 'mediaPCAPopup' + id;
		this.pcaPopupId(popupId);
		this.selectedRecordId(keyAttr);
		let mediaQuery: any = this.oj.ResponsiveUtils.getFrameworkQuery(this.oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
		if (window.matchMedia(mediaQuery).matches) {
			setTimeout(
				() => {
					let selector: any = $('#' + popupId);
					selector.ojPopup(
						'open', document.getElementById(pcaAlingId),
						{
							'at': {'horizontal': 'center', 'vertical': 'center'},
							'my': {'horizontal': 'center', 'vertical': 'center'},
							'of': window
						});
				},
				0);
		} else {
			setTimeout(
				() => {
					let selector: any = $('#' + popupId);
					selector.ojPopup(
						'open',
						document.getElementById(pcaAlingId),
						{
							at: 'center center',
							collision: 'flipfit'
						});
				},
				0);
		}
		/*
			*condition put for contextual action poup default shawdow hide
		*/
		if ('.oj-popup-content:has(hcm-contextual-action)') {
			$('.oj-popup').addClass('ocaj-default-popup');
		}
	}

	/**
	 * Raises card actions menu event
	 * @param {type} alignId
	 * @returns {none}
	 */
	public launchCardActionsMenuHanlder = (alignId: string) => {
		let params: any = {
			bubbles: true,
			detail: { alignId: alignId }
		};
		this.element.dispatchEvent(new CustomEvent('cardActionsMenuEvent', params));
	}

	/**
	 * @private
	 * Card title handler
	 * Raises cardTitleClicked event and passes priamry key of clicked row
	 * @return {none}
	 */
	public cardTitleHandler = (paramTitle: string) => {
		let params: any = {
			bubbles: true,
			detail: { keyAttribute: paramTitle }
		};
		this.element.dispatchEvent(new CustomEvent('cardTitleClicked', params));
	}

	/**
	 * @private
	 * The activated lifecycle method is called and passed the standard context
	 * object. At the point in time that this method executes,
	 * the base Composite Component element will exist in the HTML DOM,
	 * however it will not yet have .
	 * @return {none}
	 */
	public activated(context: Context): any {
		let loadTranslations: any = this.fnd.loadTranslations('oracle.apps.fnd.cardlist');
		let useTranslations: any = () => {
			let collection: any = this.fnd.getStringCollection('oracle.apps.fnd.cardlist');
			this.labelContextualActions = collection.getTranslatedString(this.labelContextualActions);
			this.labelActionsMenu = collection.getTranslatedString(this.labelActionsMenu);
			this.labelFlipCard = collection.getTranslatedString(this.labelFlipCard);
			this.labelImage = collection.getTranslatedString(this.labelImage);
		};

		return loadTranslations.then(
			useTranslations);
	}
}
export =  FndMediaCardModel;
