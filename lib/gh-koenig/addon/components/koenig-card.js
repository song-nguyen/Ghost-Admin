import Component from 'ember-component';
import layout from '../templates/components/koenig-card';
import run from 'ember-runloop';
import observer from 'ember-metal/observer';

export default Component.extend({
    layout,
    editing: observer('editedCard', function () {
        let editing = this.get('editedCard') === this.get('card');
        if(this.get('isEditing') && !editing) {
            this.send('stopEdit');
        }
        this.set('isEditing', editing);
    }),
    init() {
        this._super(...arguments);
    },
    didRender() {
        // add the classname to the wrapping card as generated by mobiledoc.
        // for some reason `this` on did render actually refers to the editor object and not the card object, after render it seems okay.
        run.schedule('afterRender', this,
            () => {
                let card = this.get('card');

                
                let {env: {name}} = card;

                // the mobiledoc generated container.
                let mobiledocCard = this.$().parents('.__mobiledoc-card');

                mobiledocCard.removeClass('__mobiledoc-card');
                mobiledocCard.addClass('kg-card');
                mobiledocCard.addClass(name ? `kg-${name}` : '');
                mobiledocCard.attr('tabindex', 3);
                mobiledocCard.click(() => {
                    if(!this.get('isEditing')) {
                        this.send('selectCardHard');
                    }
                });
            }
        );
    },
    actions: {
        save() {
            this.set('doSave', Date.now());
        },

        toggleState() {
            if(this.get('isEditing')) {
                this.send('stopEdit');
            } else {
                this.send('startEdit');
            }
        },
        selectCard() {
            this.sendAction('selectCard', this.card.id);
        },
        deselectCard() {
            this.sendAction('deselectCard', this.card.id);
            this.send('stopEdit');
        },
        selectCardHard() {
            this.sendAction('selectCardHard', this.card.id);
        },
        delete() {
            this.get('card').env.remove();
        },
        startEdit() {
            this.sendAction('edit', this.card.id)
        },
        stopEdit() {
            this.send('save');
            this.sendAction('stopEdit', this.card.id);
        }
    }
});