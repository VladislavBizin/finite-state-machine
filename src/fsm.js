class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(config === undefined) return Err;
        this.currentState = config.initial;
        this.states = config.states;
        this.history = [this.currentState];
        this.count = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(!this.states.hasOwnProperty(state)) {
            return Err;
        }
        this.currentState = state;
        this.history = [...this.history,state];
        this.count += 1;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if(!this.states[this.currentState]["transitions"].hasOwnProperty(event)) return Err;
        this.currentState = this.states[this.currentState]["transitions"][event];
        if(!this.history.includes(this.currentState)){
            this.history = [...this.history,this.currentState];
        }
        this.count += 1;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = "normal";
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event = undefined) {
        const array = Object.keys(this.states);
        const transition = (event,array) => {
            let list = [];
            for(let i = 0; i < array.length; i +=1){
                if(this.states[array[i]]["transitions"].hasOwnProperty(event)){
                    list = [...list,array[i]]
                }
            }
            return list;
        };
        return event === undefined ? array : transition(event,array);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.count){
            this.count -= 1;
            this.currentState = this.history[this.count];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.history.length > 1 && this.count + 1 < this.history.length){
            if(this.currentState === this.history[(this.history).length -1]){
                return false;
            }
            this.count = this.count + 1;
            this.currentState = this.history[this.count];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.count = 0;
        this.history = ["normal"];
    }
}
module.exports = FSM;
/** @Created by Uladzimir Halushka **/
