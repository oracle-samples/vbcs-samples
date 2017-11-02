define(['knockout', 'ojL10n!./resources/nls/card', 'ojs/ojcore', 'jquery', 
	'ojs/ojknockout', 'promise', 'ojs/ojbutton'
], function (ko, cardLabel, oj, $) {
    function FndMediaCardModel(context) {
        var self = this;
        self.url = '';
        var propsPromise = context.props;
        var element = context.element;
        self.unique = context.unique;
        self.flipFlag = ko.observable('front');
        self.pcaFlag = ko.observable(false);
        self.cardWidth = ko.observable(270);
        var CARD_BACK = '#C_backSlot';
        self.selectedRecordId = ko.observable();
        self.pcaPopupId = ko.observable();
        self.labelContextualActions = cardLabel.CARD_CONTEXTUAL_ACTIONS;
        self.labelActionsMenu = cardLabel.CARD_ACTIONS_MENU;
        self.labelFlipCard = cardLabel.FLIP_CARD;
        self.labelImage = cardLabel.USER_IMAGE;
        self.cardSize = ko.observable('small');
        self.cardHeight = ko.observable(155);

        self.pcaFlagRendered = function () {
            var isMobile = false;
            var mediaQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
            if (window.matchMedia(mediaQuery).matches) {
                isMobile = true;
            } else {
                isMobile = false;
            }
            return isMobile || self.pcaFlag();
        };

        propsPromise.then(function (props) {
            if (props.size !== undefined) {
                self.cardSize(props.size);
            }
            if (self.cardSize() === 'small') {
                self.cardHeight(155);
            } else if (self.cardSize() === 'medium') {
                self.cardHeight(245);
            } else if (self.cardSize() === 'large') {
                self.cardHeight(515);
            }
            /*
             * Checks for empty back facet
             */
            setTimeout(function () {
                if ($(CARD_BACK).children().length < 1) {
                }
                if ($('#C_card') !== undefined) {
                    var width = $('#C_card').width() - 41;
                    self.cardWidth(width);
                } else {
                    self.cardWidth(props.width - 41);
                }
            }, 0);
            var mediaQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
            if (window.matchMedia(mediaQuery).matches) {
                self.pcaFlag(true);
            }
        });

        self.closePCAPopupHandler = function () {
            $('#' + self.pcaPopupId()).ojPopup('close');
        };

        /*
         * card flip flag
         */
        self.cardFlipFlag = ko.computed(function () {
            return self.flipFlag();
        });

        /*
         * Card flip handler
         */
        self.cardFlipHandler = function (model, event) {
            $(element.childNodes[0]).toggleClass('flipped');
            if (self.flipFlag() === 'front') {
                self.flipFlag('back');
            } else {
                self.flipFlag('front');
            }
        };

        /*
         * Hide PCA
         * @returns {none}
         */
        self.hidePCAHanlder = function () {
            self.pcaFlag(false);
        };

        /*
         * Show PCA
         * @returns {none}
         */
        self.showPCAHanlder = function () {
            self.pcaFlag(true);
        };

        /*
         * Raises card PCA event
         * @returns {none}
         */
        self.launchCardPCAHanlder = function (id, pcaAlingId, keyAttr) {
            var params = {
                bubbles: true,
                detail: {
                    keyAttribute: keyAttr,
                    alignId: pcaAlingId
                }
            };
            element.dispatchEvent(new CustomEvent('cardContextualActions', params));
            /*var popupId = 'mediaPCAPopup' + id;
            self.pcaPopupId(popupId);
            self.selectedRecordId(keyAttr);
            var mediaQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
            if (window.matchMedia(mediaQuery).matches) {
                setTimeout(function () {
                    $('#' + popupId).ojPopup('open', document.getElementById(pcaAlingId),
                            {my: 'center center',
                                at: 'center center',
                                of: window});
                }, 0);
            } else {
                setTimeout(function () {
                    $('#' + popupId).ojPopup('open', document.getElementById(pcaAlingId),
                            {my: 'center center',
                                at: 'start center',
                                collision: 'flipfit'});
                }, 0);
            }
            //condition put for contextual action poup default shawdow hide
            if ('.oj-popup-content:has(hcm-contextual-action)') {
                $('.oj-popup').addClass('ocaj-default-popup');
            }*/

        };

        /*
         * Raises card actions menu event
         * @param {type} alignId
         * @returns {none}
         */
        self.launchCardActionsMenuHanlder = function (alignId) {
            var params = {
                bubbles: true,
                detail: {alignId: alignId}
            };
            element.dispatchEvent(new CustomEvent('cardActionsMenuEvent', params));
        };

        /*
         * Card title handler
         */
        self.cardTitleHandler = function (paramTitle) {
            // fire custom event
            var params = {
                bubbles: true,
                detail: {keyAttribute: paramTitle}
            };
            element.dispatchEvent(new CustomEvent('cardTitleClicked', params));
        };

        self.activated = function () {
            /*var loadTranslations = fnd.loadTranslations('oracle.apps.fnd.cardlist');
             var useTranslations = function () {
             var collection = fnd.getStringCollection('oracle.apps.fnd.cardlist');
             self.labelContextualActions = collection.getTranslatedString(self.labelContextualActions);
             self.labelActionsMenu = collection.getTranslatedString(self.labelActionsMenu);
             self.labelFlipCard = collection.getTranslatedString(self.labelFlipCard);
             self.labelImage = collection.getTranslatedString(self.labelImage);
             };
             
             return loadTranslations.then(
             useTranslations,
             function () {
             // Failed to download translations
             });*/
        };
    }
    return FndMediaCardModel;
});
